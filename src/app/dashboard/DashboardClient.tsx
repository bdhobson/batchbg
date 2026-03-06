'use client';

import { useEffect } from 'react';

export default function DashboardClient() {
  useEffect(() => {
    const btn = document.getElementById('manage-subscription-btn');
    if (!btn) return;

    async function handleClick() {
      btn!.textContent = 'Loading...';
      try {
        const res = await fetch('/api/stripe/portal', { method: 'POST' });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          btn!.textContent = 'Manage subscription';
          alert(data.error || 'Failed to open portal');
        }
      } catch {
        btn!.textContent = 'Manage subscription';
        alert('Something went wrong');
      }
    }

    btn.addEventListener('click', handleClick);
    return () => btn.removeEventListener('click', handleClick);
  }, []);

  return null;
}
