-- Cleanup duplicate supplier policies
DROP POLICY IF EXISTS "Users can insert their own suppliers" ON suppliers;

-- Verify clean state
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename = 'suppliers'
ORDER BY policyname;
