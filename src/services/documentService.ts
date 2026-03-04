import { supabase } from '../lib/supabase';

export interface DocumentMetadata {
  issuer: string;
  recipient: string;
  role: string;
  date: string;
  hash?: string;
  fileName?: string;
}

export async function notarizeDocument(metadata: DocumentMetadata, hash: string, fileName?: string) {
  const { data, error } = await supabase
    .from('certificates')
    .insert([
      { 
        hash, 
        issuer: metadata.issuer, 
        recipient: metadata.recipient, 
        role: metadata.role, 
        date: metadata.date,
        file_name: fileName
      }
    ])
    .select();

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Este documento ya ha sido notarizado previamente.');
    }
    throw error;
  }
  return data;
}

export async function verifyDocument(hash: string): Promise<DocumentMetadata | null> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('hash', hash)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return null;
    }
    throw error;
  }

  return data as DocumentMetadata;
}

export async function analyzeDocument(file: File): Promise<DocumentMetadata> {
  // Convert file to base64
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const base64Data = await base64Promise;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileData: base64Data,
      mimeType: file.type || 'application/pdf',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 429) {
      throw new Error("Límite de demo alcanzado (3 archivos cada 24 horas).");
    }
    
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.error || "Error al analizar el documento.");
    } catch (e) {
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error('El servidor devolvió una página de error HTML. Es posible que el backend no esté funcionando correctamente.');
      }
      throw new Error(`Error del servidor (${response.status}): ${text.substring(0, 100)}`);
    }
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as DocumentMetadata;
  } catch (e) {
    console.error('Error al parsear respuesta:', text);
    throw new Error('La respuesta del servidor no es un JSON válido.');
  }
}

export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
}
