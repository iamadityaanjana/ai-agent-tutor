import React from 'react';

export default function TestComponent() {
  return (
    <div className="mx-4 my-6 p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
      <h2 className="text-2xl font-bold mb-2">Test Component</h2>
      <p className="mb-4">This is a test component to see if Tailwind CSS is working.</p>
      <div className="flex space-x-2">
        <div className="bg-white text-blue-500 px-4 py-2 rounded font-medium">Button 1</div>
        <div className="bg-blue-700 text-white px-4 py-2 rounded font-medium">Button 2</div>
      </div>
    </div>
  );
}
