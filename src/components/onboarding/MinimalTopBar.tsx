import ProgressBar from './ProgressBar';

export default function MinimalTopBar() {
  return (
    <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">OneTake</h1>
        </div>
        <div className="ml-auto w-64">
          <ProgressBar />
        </div>
      </div>
    </div>
  );
}