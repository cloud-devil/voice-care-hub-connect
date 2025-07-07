
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setTranscript('Voice recording stopped');
    } else {
      setIsListening(true);
      setTranscript('Listening... Say something!');
      // This will be connected to VAPI when integrated
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={toggleListening}
          className={`rounded-full w-16 h-16 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="rounded-full w-12 h-12"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Status Display */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          isListening ? 'text-red-600' : 'text-gray-600'
        }`}>
          {isListening ? 'Listening...' : 'Click to speak'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>You:</strong> {transcript}
          </p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Assistant:</strong> {response}
          </p>
        </div>
      )}

      {/* Connection Status */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Voice Assistant Status: 
          <span className="ml-1 font-medium text-orange-600">
            Waiting for VAPI integration
          </span>
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
