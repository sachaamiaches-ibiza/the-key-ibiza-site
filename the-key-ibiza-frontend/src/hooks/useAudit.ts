/**
 * Audit Tracking Hook
 * Tracks user sessions and actions for analytics
 */

import { useEffect, useRef } from 'react';

const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

const AUDIT_STORAGE_KEY = 'thekey-audit-id';

// Tipos de acciones que se pueden trackear
export type AuditActionType =
  | 'page_view'
  | 'villa_view'
  | 'yacht_view'
  | 'catamaran_view'
  | 'search'
  | 'filter_apply'
  | 'pdf_download'
  | 'contact_form'
  | 'vip_login'
  | 'booking_request'
  | 'gallery_open'
  | 'calendar_select';

export interface AuditMetadata {
  [key: string]: string | number | boolean | object | null | undefined;
}

// Inicializar sesión de audit
async function initAudit(vipId?: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/audit/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vipId: vipId || null })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(AUDIT_STORAGE_KEY, data.auditId);
      return data.auditId;
    }
  } catch (error) {
    console.error('Failed to init audit:', error);
  }
  return null;
}

// Obtener o crear audit ID
export async function getOrCreateAuditId(vipId?: string): Promise<string | null> {
  let auditId = localStorage.getItem(AUDIT_STORAGE_KEY);

  if (!auditId) {
    auditId = await initAudit(vipId);
  }

  return auditId;
}

// Trackear una acción
export async function trackAction(
  action: AuditActionType,
  url: string,
  metadata?: AuditMetadata
): Promise<void> {
  const auditId = localStorage.getItem(AUDIT_STORAGE_KEY);

  if (!auditId) {
    // Intentar crear sesión si no existe
    const newAuditId = await initAudit();
    if (!newAuditId) {
      console.warn('No audit ID found, skipping tracking');
      return;
    }
  }

  try {
    await fetch(`${BACKEND_URL}/api/audit/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auditId: localStorage.getItem(AUDIT_STORAGE_KEY),
        url,
        action,
        metadata
      })
    });
  } catch (error) {
    console.error('Failed to track action:', error);
  }
}

// Vincular sesión con VIP después del login
export async function linkAuditToVip(vipId: string): Promise<void> {
  const auditId = localStorage.getItem(AUDIT_STORAGE_KEY);

  if (!auditId) return;

  try {
    await fetch(`${BACKEND_URL}/api/audit/link-vip`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditId, vipId })
    });
  } catch (error) {
    console.error('Failed to link VIP:', error);
  }
}

// Hook para tracking automático de páginas
export function usePageTracking(currentView: string): void {
  const previousView = useRef<string>('');
  const initialized = useRef<boolean>(false);

  // Inicializar audit al cargar la app (solo una vez)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getOrCreateAuditId();
    }
  }, []);

  // Trackear cambio de vista/página
  useEffect(() => {
    if (currentView && currentView !== previousView.current) {
      previousView.current = currentView;

      // Determinar tipo de acción según la vista
      let action: AuditActionType = 'page_view';
      const metadata: AuditMetadata = { view: currentView };

      if (currentView.startsWith('villa-')) {
        action = 'villa_view';
        metadata.villaId = currentView.replace('villa-', '');
      } else if (currentView.startsWith('yacht-')) {
        action = 'yacht_view';
        metadata.yachtId = currentView.replace('yacht-', '');
      } else if (currentView.startsWith('blog-')) {
        action = 'page_view';
        metadata.articleSlug = currentView.replace('blog-', '');
      }

      trackAction(action, `/${currentView}`, metadata);
    }
  }, [currentView]);
}

// Helper para trackear búsquedas
export function trackSearch(
  page: string,
  filters: Record<string, string | number | boolean | null>
): void {
  trackAction('search', `/${page}`, { filters });
}

// Helper para trackear descarga de PDF
export function trackPdfDownload(
  villaName: string,
  pdfType: 'brochure' | 'pricing' | 'availability'
): void {
  trackAction('pdf_download', '/pdf-download', { villaName, pdfType });
}

// Helper para trackear formulario de contacto
export function trackContactForm(
  service: string,
  formType: 'inquiry' | 'booking' | 'general'
): void {
  trackAction('contact_form', '/contact', { service, formType });
}

// Helper para trackear apertura de galería
export function trackGalleryOpen(
  itemType: 'villa' | 'yacht' | 'catamaran',
  itemName: string
): void {
  trackAction('gallery_open', `/gallery/${itemType}`, { itemType, itemName });
}
