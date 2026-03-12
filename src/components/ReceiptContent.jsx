import OrderEmailHeader from './OrderEmailHeader'
import OrderConfirmationEmailBody from './OrderConfirmationEmailBody'
import OrderEmailFooterActions from './OrderEmailFooterActions'

/**
 * Shared receipt content - used in Receipt Preview page and for PDF generation.
 * OrderEmailFooterActions at bottom, outside the teal body section.
 */
export default function ReceiptContent({ order }) {
  return (
    <div
      className="w-full max-w-[210mm] overflow-visible bg-white shadow-lg"
      style={{ minHeight: '297mm', aspectRatio: '210/297' }}
    >
      <div className="mx-[15mm] flex flex-col py-[15mm]">
        <div className="mb-6 overflow-visible">
          <OrderEmailHeader order={order} />
        </div>
        <OrderConfirmationEmailBody order={order} />
        <div className="mt-8 flex justify-start border-t border-gray-200 pt-8">
          <OrderEmailFooterActions />
        </div>
      </div>
    </div>
  )
}
