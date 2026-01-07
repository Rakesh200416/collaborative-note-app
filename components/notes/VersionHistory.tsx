'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Spinner,
} from '@nextui-org/react';
import { Clock, RotateCcw, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Version } from '@/store/useNoteStore';
import { api } from '@/services/api';
import RichTextEditor from '../editor/RichTextEditor';

interface VersionHistoryProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (versionId: string) => void;
}

export default function VersionHistory({
  noteId,
  isOpen,
  onClose,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && noteId) {
      loadVersions();
    }
  }, [isOpen, noteId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getVersions(noteId);
      setVersions(data);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (versionId: string) => {
    onRestore(versionId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Clock size={20} />
          Version History
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto">
                {versions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No version history available
                  </p>
                ) : (
                  versions.map((version) => (
                    <Card
                      key={version._id}
                      isPressable
                      isHoverable
                      className={`cursor-pointer ${
                        selectedVersion?._id === version._id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                          : ''
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <CardBody className="p-3">
                        <div className="flex items-start gap-2">
                          <User size={16} className="mt-1 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {version.editedBy?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(version.timestamp))}{' '}
                              ago
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>

              <div className="lg:col-span-2">
                {selectedVersion ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Edited by {selectedVersion.editedBy?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedVersion.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        color="primary"
                        startContent={<RotateCcw size={16} />}
                        onClick={() => handleRestore(selectedVersion._id)}
                      >
                        Restore This Version
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                      <RichTextEditor
                        content={selectedVersion.content}
                        onChange={() => {}}
                        editable={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a version to preview
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
