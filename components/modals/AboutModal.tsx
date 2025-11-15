
import React from 'react';
import { Modal } from '../ui/Modal';
import { useCoreUI } from '../../contexts/AppContext';
import { Button } from '../ui/Button';

export const AboutModal: React.FC = () => {
  const { isAboutModalOpen, closeAboutModal } = useCoreUI();

  return (
    <Modal isOpen={isAboutModalOpen} onClose={closeAboutModal} title="Sobre o Kimetsu Forge">
      <div className="space-y-4 text-text-secondary">
        <p>
            O Kimetsu Forge é uma aplicação poderosa e criativa, projetada para explorar e expandir o universo de Kimetsu no Yaiba (Demon Slayer). 
            Utilizando a IA generativa do Google Gemini, esta ferramenta permite que fãs, criadores de conteúdo e escritores gerem, personalizem e gerenciem uma vasta gama de elementos narrativos.
        </p>
        <p>
            Da criação de personagens e técnicas de respiração únicas à geração de conflitos épicos e locais detalhados, o Forge é o seu ferreiro digital para moldar novas histórias.
        </p>
        <div className="pt-4 flex justify-end">
            <Button onClick={closeAboutModal} variant="secondary">
                Fechar
            </Button>
        </div>
      </div>
    </Modal>
  );
};
