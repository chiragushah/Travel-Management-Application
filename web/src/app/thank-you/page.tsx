export default function ThankYouPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-4">
      <h1 className="text-3xl font-semibold">Thank you!</h1>
      <p>Your booking has been received. You will receive a confirmation email shortly.</p>
      {searchParams.order ? (
        <p className="text-sm text-gray-600">Order reference: {searchParams.order}</p>
      ) : null}
    </div>
  );
}
