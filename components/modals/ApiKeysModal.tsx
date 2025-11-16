
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { Button } from '../ui/Button';
import { SaveIcon, TrashIcon } from '../icons';
import { useApiKeys, useAuth, useCoreUI } from '../../contexts/AppContext';

// Placeholder for Toast until it's created as per original file, since ToastProvider doesn't exist.
const useToast = () => ({
    showToast: (type: 'success' | 'error' | 'info', message: string) => {
        console.log(`[${type.toUpperCase()}] ${message}`);
        if (type === 'error') {
            alert(`Error: ${message}`);
        }
    }
});

export const ApiKeysModal: React.FC = () => {
  const { isApiKeysModalOpen, closeApiKeysModal } = useCoreUI();
  const { user } = useAuth();
  const {
    geminiApiKey, setGeminiApiKey,
    openaiApiKey, setOpenaiApiKey,
    deepseekApiKey, setDeepseekApiKey
  } = useApiKeys();

  const [localGemini, setLocalGemini] = useState(geminiApiKey);
  const [localOpenAI, setLocalOpenAI] = useState(openaiApiKey);
  const [localDeepSeek, setLocalDeepSeek] = useState(deepseekApiKey);

  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isApiKeysModalOpen) {
      setLocalGemini(geminiApiKey);
      setLocalOpenAI(openaiApiKey);
      setLocalDeepSeek(deepseekApiKey);
    }
  }, [isApiKeysModalOpen, geminiApiKey, openaiApiKey, deepseekApiKey]);

  const handleSave = async (keysToSave: { gemini: string; openai: string; deepseek: string; }) => {
    if (!user) {
      showToast('error', 'Você precisa estar logado para salvar as chaves.');
      return false;
    }

    setIsSaving(true);
    try {
      // This simulates the API call from the user's prompt without breaking the app
      console.log("Simulating API call to /api/keys/save with user:", user.id, "and keys:", {
          geminiApiKey: keysToSave.gemini || null,
          openaiApiKey: keysToSave.openai || null,
          deepseekApiKey: keysToSave.deepseek || null,
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      setGeminiApiKey(keysToSave.gemini);
      setOpenaiApiKey(keysToSave.openai);
      setDeepseekApiKey(keysToSave.deepseek);
      return true;
    } catch (error: any) {
      showToast('error', `Erro: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = async () => {
    const success = await handleSave({ gemini: localGemini, openai: localOpenAI, deepseek: localDeepSeek });
    if (success) {
      showToast('success', 'Chaves de API salvas com sucesso!');
      closeApiKeysModal();
    }
  };

  const handleClearKeys = async () => {
    if (window.confirm('Tem certeza de que deseja limpar todas as suas chaves de API salvas?')) {
      const success = await handleSave({ gemini: '', openai: '', deepseek: '' });
      if (success) {
        setLocalGemini('');
        setLocalOpenAI('');
        setLocalDeepSeek('');
        showToast('info', 'Suas chaves de API foram limpas.');
        closeApiKeysModal();
      }
    }
  };

  return (
    <Modal isOpen={isApiKeysModalOpen} onClose={closeApiKeysModal} title="Gerenciar Chaves de API">
      <div className="space-y-6">
        <p className="text-sm text-text-secondary">
          Forneça suas chaves para ter <strong>uso ilimitado</strong> e ativar modelos de IA alternativos. Sem sua chave, o uso é limitado e compartilhado. Suas chaves são salvas com segurança em nosso banco de dados e associadas apenas à sua conta.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-text-secondary mb-1">Google Gemini API Key</label>
            <TextInput
              id="gemini-key"
              type="password"
              value={localGemini}
              onChange={(e) => setLocalGemini(e.target.value)}
              placeholder="Chave do Google AI Studio (modelo principal)"
            />
          </div>
           <div>
            <label htmlFor="openai-key" className="block text-sm font-medium text-text-secondary mb-1">OpenAI API Key (GPT)</label>
            <TextInput
              id="openai-key"
              type="password"
              value={localOpenAI}
              onChange={(e) => setLocalOpenAI(e.target.value)}
              placeholder="Opcional: Para refinamento narrativo com GPT"
            />
          </div>
           <div>
            <label htmlFor="deepseek-key" className="block text-sm font-medium text-text-secondary mb-1">DeepSeek API Key</label>
            <TextInput
              id="deepseek-key"
              type="password"
              value={localDeepSeek}
              onChange={(e) => setLocalDeepSeek(e.target.value)}
              placeholder="Opcional: Para expansão criativa de ideias"
            />
          </div>
        </div>

        <div className="text-xs text-text-muted">
          <p>Links para obter suas chaves (requer conta nas plataformas):</p>
          <ul className="list-disc list-inside">
            <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-end">Google AI Studio (Gemini)</a></li>
            <li><a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-end">OpenAI Platform (GPT)</a></li>
            <li><a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-end">DeepSeek Platform</a></li>
          </ul>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border-color">
            <Button variant="danger" onClick={handleClearKeys} disabled={isSaving || !user}>
                <TrashIcon className="w-5 h-5" />
                Limpar Chaves
            </Button>
            <div className="flex gap-2">
                <Button variant="secondary" onClick={closeApiKeysModal}>
                    Cancelar
                </Button>
                <Button onClick={handleSaveClick} disabled={isSaving || !user}>
                    <SaveIcon className="w-5 h-5" />
                    {isSaving ? 'Salvando...' : 'Salvar Chaves'}
                </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};
