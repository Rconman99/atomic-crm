import { useState } from "react";
import { useDataProvider, useNotify, useRedirect, useRefresh } from "ra-core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Lead } from "../types";

export const LeadConvert = ({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead: Lead;
}) => {
  const [dealName, setDealName] = useState(`${lead.company_name || lead.first_name} — Website Build`);
  const [dealAmount, setDealAmount] = useState("");
  const [createDeal, setCreateDeal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await (dataProvider as any).convertLead(
        lead.id,
        createDeal ? dealName : undefined,
        createDeal && dealAmount ? Number(dealAmount) : undefined,
      );
      notify("Lead converted successfully!", { type: "success" });
      onClose();
      refresh();
      if (result?.contact_id) {
        redirect(`/contacts/${result.contact_id}/show`);
      }
    } catch (err: any) {
      setError(err?.message || "Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convert Lead to Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-md bg-muted p-3 text-sm">
            <p>
              <strong>{lead.first_name} {lead.last_name}</strong>
            </p>
            {lead.email && <p className="text-muted-foreground">{lead.email}</p>}
            {lead.company_name && (
              <p className="text-muted-foreground">{lead.company_name}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="createDeal"
              checked={createDeal}
              onChange={(e) => setCreateDeal(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="createDeal" className="text-sm">
              Also create a deal
            </Label>
          </div>

          {createDeal && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="dealName" className="text-xs">
                  Deal Name
                </Label>
                <Input
                  id="dealName"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dealAmount" className="text-xs">
                  Deal Amount ($)
                </Label>
                <Input
                  id="dealAmount"
                  type="number"
                  value={dealAmount}
                  onChange={(e) => setDealAmount(e.target.value)}
                  placeholder="5000"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
