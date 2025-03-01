import { useState } from 'react';

interface DatabaseConnectorProps {
  onConnect: (connectionString: string) => void;
}

export default function DatabaseConnector({ onConnect }: DatabaseConnectorProps) {
  const [connectionString, setConnectionString] = useState('');

  const handleConnect = () => {
    onConnect(connectionString);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={connectionString}
        onChange={(e) => setConnectionString(e.target.value)}
        placeholder="输入数据库连接字符串"
        className="w-full p-2 rounded"
      />
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        连接数据库
      </button>
    </div>
  );
}