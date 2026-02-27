import React, { useState } from 'react';
import { Blocks, CheckCircle, ExternalLink, MessageSquare, Slack, CreditCard, Cloud, Youtube, AlertCircle, RefreshCw, Send, X } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'Communication' | 'Finance' | 'Social' | 'Storage';
  status: 'Connected' | 'Disconnected' | 'Pending';
}

const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'discord', name: 'Discord', description: 'Send automated announcements and stats to your community server.', icon: MessageSquare, color: 'text-indigo-400', category: 'Communication', status: 'Disconnected' },
    { id: 'slack', name: 'Slack', description: 'Notify your team about payouts, new creators, and system alerts.', icon: Slack, color: 'text-emerald-400', category: 'Communication', status: 'Disconnected' },
    { id: 'youtube', name: 'YouTube Network', description: 'Sync MCN-level analytics and CMS asset management rights.', icon: Youtube, color: 'text-red-500', category: 'Social', status: 'Connected' },
    { id: 'stripe', name: 'Stripe', description: 'Process international payouts and handle subscription billing.', icon: CreditCard, color: 'text-blue-400', category: 'Finance', status: 'Disconnected' },
    { id: 'drive', name: 'Google Drive', description: 'Automated contract backup and asset sharing for creators.', icon: Cloud, color: 'text-yellow-400', category: 'Storage', status: 'Disconnected' },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [testNotificationStatus, setTestNotificationStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleConnectClick = (integration: Integration) => {
    if (integration.status === 'Connected') {
       if (confirm(`Do you want to disconnect ${integration.name}?`)) {
           updateStatus(integration.id, 'Disconnected');
       }
    } else {
        setSelectedIntegration(integration);
        setWebhookUrl('');
    }
  };

  const updateStatus = (id: string, status: 'Connected' | 'Disconnected') => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const handleConfirmConnect = () => {
      setIsConnecting(true);
      // Simulate API verification
      setTimeout(() => {
          if (selectedIntegration) {
              updateStatus(selectedIntegration.id, 'Connected');
              setIsConnecting(false);
              setSelectedIntegration(null);
          }
      }, 1500);
  };

  const handleTestNotification = () => {
      setTestNotificationStatus('sending');
      setTimeout(() => setTestNotificationStatus('sent'), 1500);
      setTimeout(() => setTestNotificationStatus('idle'), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orbit-800 to-indigo-900/40 rounded-3xl p-8 border border-orbit-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
             <Blocks size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orbit-500 rounded-lg">
                    <Blocks className="text-white w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-white">Integrations Hub</h1>
            </div>
            <p className="text-gray-300 text-lg">
                Supercharge your network operations. Connect MediaStar MCN to your favorite tools for seamless communication, automated finance, and streamlined workflows.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {integrations.map((item) => {
              const Icon = item.icon;
              return (
                  <div key={item.id} className="bg-orbit-800 border border-orbit-700 rounded-2xl p-6 hover:border-orbit-500 transition-all group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl bg-orbit-900 border border-orbit-700 ${item.color}`}>
                              <Icon size={28} />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              item.status === 'Connected' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                          }`}>
                              {item.status}
                          </span>
                      </div>
                      
                      <div className="mb-6 flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="mt-auto">
                        {item.status === 'Connected' && item.id === 'discord' ? (
                             <button 
                                onClick={() => setSelectedIntegration(item)}
                                className="w-full py-2.5 bg-orbit-700 hover:bg-orbit-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                             >
                                <Blocks size={16} />
                                Manage Settings
                             </button>
                        ) : (
                            <button 
                                onClick={() => handleConnectClick(item)}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-95 ${
                                    item.status === 'Connected' 
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                                    : 'bg-orbit-500 hover:bg-orbit-400 text-white shadow-lg shadow-orbit-500/20'
                                }`}
                            >
                                {item.status === 'Connected' ? 'Disconnect' : 'Connect'}
                            </button>
                        )}
                      </div>
                  </div>
              )
          })}
      </div>

      {/* Connection Modal */}
      {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedIntegration(null)}>
              <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                  
                  <div className="p-6 border-b border-orbit-700 bg-orbit-800 flex justify-between items-center">
                       <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg bg-orbit-900 ${selectedIntegration.color}`}>
                                <selectedIntegration.icon size={20} />
                           </div>
                           <h3 className="text-lg font-bold text-white">
                               {selectedIntegration.status === 'Connected' ? `Manage ${selectedIntegration.name}` : `Connect ${selectedIntegration.name}`}
                           </h3>
                       </div>
                       <button onClick={() => setSelectedIntegration(null)} className="text-gray-400 hover:text-white">
                           <X size={20} />
                       </button>
                  </div>

                  <div className="p-6 space-y-6">
                      {selectedIntegration.id === 'discord' ? (
                          <>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-400">Webhook URL</label>
                                <input 
                                    type="text" 
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    placeholder="https://discord.com/api/webhooks/..."
                                    className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:border-orbit-500 outline-none transition-colors"
                                    disabled={selectedIntegration.status === 'Connected'}
                                />
                                <p className="text-xs text-gray-500">
                                    Paste the webhook URL from your Discord Server Settings {'>'} Integrations {'>'} Webhooks.
                                </p>
                            </div>

                            {selectedIntegration.status === 'Connected' && (
                                <div className="p-4 bg-orbit-800 rounded-xl border border-orbit-700">
                                    <h4 className="font-medium text-white text-sm mb-3">Test Connection</h4>
                                    <button 
                                        onClick={handleTestNotification}
                                        disabled={testNotificationStatus !== 'idle'}
                                        className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        {testNotificationStatus === 'idle' && <Send size={14} />}
                                        {testNotificationStatus === 'sending' && <RefreshCw size={14} className="animate-spin" />}
                                        {testNotificationStatus === 'sent' && <CheckCircle size={14} />}
                                        <span>
                                            {testNotificationStatus === 'idle' && "Send Test Notification"}
                                            {testNotificationStatus === 'sending' && "Sending..."}
                                            {testNotificationStatus === 'sent' && "Sent Successfully!"}
                                        </span>
                                    </button>
                                </div>
                            )}
                          </>
                      ) : (
                          <div className="text-center py-8">
                              <div className="w-16 h-16 bg-orbit-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-orbit-700">
                                  <ExternalLink size={24} className="text-gray-400" />
                              </div>
                              <p className="text-gray-300">
                                  You will be redirected to <strong>{selectedIntegration.name}</strong> to authorize MediaStar MCN.
                              </p>
                          </div>
                      )}

                      {/* Generic Warning for Disconnect */}
                      {selectedIntegration.status === 'Connected' && (
                          <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/10">
                              <AlertCircle size={16} className="text-red-400 mt-0.5" />
                              <p className="text-xs text-red-300">
                                  Disconnecting will stop all automated actions associated with this service immediately.
                              </p>
                          </div>
                      )}
                  </div>

                  <div className="p-6 bg-orbit-800 border-t border-orbit-700 flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedIntegration(null)}
                        className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
                      >
                          Cancel
                      </button>
                      
                      {selectedIntegration.status === 'Connected' ? (
                           <button 
                            onClick={() => { updateStatus(selectedIntegration.id, 'Disconnected'); setSelectedIntegration(null); }}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
                           >
                            Disconnect
                           </button>
                      ) : (
                          <button 
                            onClick={handleConfirmConnect}
                            disabled={isConnecting || (selectedIntegration.id === 'discord' && !webhookUrl)}
                            className="px-6 py-2 bg-orbit-500 hover:bg-orbit-400 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orbit-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                           >
                            {isConnecting && <RefreshCw size={16} className="animate-spin" />}
                            {isConnecting ? 'Connecting...' : 'Connect Service'}
                           </button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default IntegrationsView;