import { formatDate } from '../../../lib/utils'
import { toast } from 'sonner'

/**
 * Utility function to handle standalone ticket printing via browser pop-up.
 * Generates an isolated, printable HTML document styled for boarding passes.
 *
 * @param {Object} ticket - Ticket data including registration, event, venue, and attendee details
 * @param {string} [userEmail] - Fallback email if attendee email is empty
 */
export function printTicket(ticket, userEmail = '') {
  if (!ticket) return

  const printWindow = window.open('', '_blank', 'width=800,height=900')
  if (!printWindow) {
    toast.error('Gagal membuka jendela cetak. Pastikan pop-up diizinkan di browser.')
    return
  }

  const event = ticket.registration?.event
  const venue = event?.venue
  const isCheckedIn = ticket.status === 'checked-in'
  const isOnline = venue?.type === 'online'

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>E-Tiket: ${event?.name || 'Tiket Acara'} - ${ticket.ticket_code}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        body { background: #f1f5f9; padding: 40px 20px; color: #0f172a; display: flex; justify-content: center; }
        .ticket-card { background: #fff; width: 100%; max-width: 680px; border-radius: 20px; border: 2px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); }
        .ticket-header { background: #090A0F; color: #fff; padding: 24px 30px; position: relative; border-bottom: 2px dashed #334155; }
        .brand { font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #FF5C00; margin-bottom: 8px; }
        .event-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .event-meta { font-size: 13px; color: #94a3b8; }
        .ticket-body { padding: 30px; display: grid; grid-template-columns: 1fr 200px; gap: 24px; }
        .info-group { margin-bottom: 18px; }
        .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #0f172a; }
        .qr-container { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; border-radius: 16px; padding: 18px; border: 1px solid #e2e8f0; text-align: center; }
        .ticket-code { font-family: monospace; font-size: 15px; font-weight: 800; color: #FF5C00; margin-top: 10px; letter-spacing: 1.5px; }
        .stamp { display: inline-block; padding: 6px 14px; border: 2px solid ${isCheckedIn ? '#10b981' : '#FF5C00'}; color: ${isCheckedIn ? '#059669' : '#c2410c'}; font-size: 12px; font-weight: 800; text-transform: uppercase; border-radius: 8px; margin-top: 8px; letter-spacing: 1px; }
        .ticket-footer { background: #f8fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
        @media print {
          body { background: transparent; padding: 0; }
          .ticket-card { box-shadow: none; border: 1px solid #94a3b8; width: 100%; max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="ticket-card">
        <div class="ticket-header">
          <div class="brand">ACARA TECH • E-TICKET BOARDING PASS</div>
          <div class="event-title">${event?.name || 'Acara'}</div>
          <div class="event-meta">${formatDate(event?.start_time)} WIB</div>
        </div>
        <div class="ticket-body">
          <div>
            <div class="info-group">
              <div class="info-label">Nama Peserta</div>
              <div class="info-value" style="font-size: 16px;">${ticket.attendee_name || '-'}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Email</div>
              <div class="info-value">${ticket.attendee_email || userEmail || '-'}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Kategori Tiket</div>
              <div class="info-value">${ticket.ticket_type?.name || 'General Admission'}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Lokasi / Venue</div>
              <div class="info-value">${isOnline ? (venue?.platform || 'Online Webinar') : `${venue?.name || ''} - ${venue?.address || ''}`}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Nomor Registrasi</div>
              <div class="info-value" style="font-family: monospace;">${ticket.registration?.registration_number || '-'}</div>
            </div>
          </div>
          <div class="qr-container">
            <div id="print-qrcode"></div>
            <div class="ticket-code">${ticket.ticket_code}</div>
            <div class="stamp">${isCheckedIn ? 'CHECKED IN' : 'VALID / AKTIF'}</div>
          </div>
        </div>
        <div class="ticket-footer">
          Tunjukkan QR Code ini pada petugas di gerbang masuk acara. Tiket ini hanya berlaku 1 kali scan.
        </div>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      <script>
        new QRCode(document.getElementById('print-qrcode'), {
          text: "${ticket.ticket_code}",
          width: 140,
          height: 140,
          correctLevel: QRCode.CorrectLevel.H
        });
        setTimeout(function() {
          window.print();
        }, 450);
      </script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
