
import React from 'react';
import { Modal } from '../ui/Modal';
import { useCoreUI } from '../../contexts/AppContext';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';

export const ApiKeysModal: React.FC = () => {
  const { isApiKeysModalOpen, closeApiKeysModal } = useCoreUI();
  // const { apiKeys, addApiKey, setActiveApiKey } = useApiKeys(); // To be used later

  return (
    <Modal isOpen={isApiKeysModalOpen} onClose={closeApiKeysModal} title="Gerenciar Chaves de API">
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Adicione e gerencie suas chaves de API do Google Gemini aqui. A chave ativa será usada para todas as solicitações.
        </p>
        <div>
            {/* Placeholder for list of keys */}
            <div className="h-32 flex items-center justify-center border border-dashed border-border-color rounded-md">
                <p className="text-text-muted">Nenhuma chave de API adicionada.</p>
            </div>
        </div>
        <div className="space-y-2">
            <TextInput label="Nome da Chave" placeholder="Ex: Minha Chave Pessoal"/>
            <TextInput label="Chave de API" placeholder="Cole sua chave aqui" type="password"/>
        </div>
        <div className="pt-4 flex justify-end gap-2">
            <Button onClick={closeApiKeysModal} variant="secondary">
                Cancelar
            </Button>
            <Button onClick={() => { /* addApiKey logic here */ }}>
                Salvar Chave
            </Button>
        </div>
      </div>
    </Modal>
  );
};
