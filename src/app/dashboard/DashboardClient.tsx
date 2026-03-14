'use client';

import { useEffect } from 'react';

export default function DashboardClient() {
  useEffect(() => {
    const btn = document.getElementById('manage-subscription-btn');
    const errEl = document.getElementById('manage-subscription-error');
    if (!btn) return;

    async function handleClick() {
      if (errEl) errEl.textContent = '';
      btn!.textContent = 'Loading...';
      try {
        const res = await fetch('/api/stripe/portal', { method: 'POST' });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          btn!.textContent = 'Manage subscription';
          if (errEl) errEl.textContent = 'Could not open billing portal. Please try again.';
        }
      } catch {
        btn!.textContent = 'Manage subscription';
        if (errEl) errEl.textContent = 'Something went wrong. Please try again.';
      }
    }

    btn.addEventListener('click', handleClick);
    return () => btn.removeEventListener('click', handleClick);
  }, []);

  return null;
}
