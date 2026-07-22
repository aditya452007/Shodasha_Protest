'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { fetchApi } from '@/lib/api';
import { REPORT_REASONS, ReportReason } from '@shodasha/shared';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  commentId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  postId,
  commentId,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const reportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchApi<{ id: string; message: string }>('/api/v1/reports', {
        method: 'POST',
        body: JSON.stringify({
          postId,
          commentId,
          reason: selectedReason,
          details: details.trim() || undefined,
        }),
      });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMsg(data?.message || 'Report submitted successfully.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Inappropriate Content">
      {successMsg ? (
        <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
          {successMsg}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-950 uppercase tracking-wider mb-2">
              Reason for Report
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    selectedReason === reason
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-950'
                  }`}
                >
                  {reason.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Additional Details (Optional)"
            placeholder="Describe why this content violates community guidelines..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={300}
            currentLength={details.length}
          />

          {reportMutation.isError && (
            <p className="text-xs text-red-600 font-medium">
              {(reportMutation.error as Error).message}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={reportMutation.isPending} className="text-xs font-bold">
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

