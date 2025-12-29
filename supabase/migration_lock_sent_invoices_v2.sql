-- Migration Fix: Lock Status Transitions for Users
-- Previous policy allowed status change because it only checked initial state was DRAFT.
-- We need to ensure that the NEW status is ALSO DRAFT (i.e., user cannot change functionality to SENT/PAID manually).

DROP POLICY IF EXISTS "users_can_update_only_draft_invoices" ON invoices;

CREATE POLICY "users_can_update_only_draft_invoices"
ON invoices FOR UPDATE
USING (
  auth.uid() = user_id 
  AND status = 'DRAFT'
)
WITH CHECK (
  auth.uid() = user_id
  AND status = 'DRAFT' -- Force status to remain DRAFT during user updates. Status changes must go via Service Role.
  -- Existing protections for financial integrity
  AND amount IS NOT DISTINCT FROM (SELECT i.amount FROM invoices i WHERE i.id = invoices.id)
  AND subtotal IS NOT DISTINCT FROM (SELECT i.subtotal FROM invoices i WHERE i.id = invoices.id)
  AND total_amount IS NOT DISTINCT FROM (SELECT i.total_amount FROM invoices i WHERE i.id = invoices.id)
);
