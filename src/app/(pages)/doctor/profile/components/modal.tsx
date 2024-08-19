export const SuccessModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="text-lg font-semibold mb-4">Success</h4>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  