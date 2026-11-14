import { ComboboxField } from '@/components/controls/combobox-field';
import { useAssignableUsers } from '@/features/users/hooks/use-assignable-users';
import { useAssignIssue } from '../hooks/use-assign-issue';

interface AssigneeComboboxProps {
  issueId: string;
  assigneeId: string | null;
  disabled?: boolean;
}

export function AssigneeCombobox({ issueId, assigneeId, disabled }: AssigneeComboboxProps) {
  const { data: users, isPending } = useAssignableUsers();
  const assignMutation = useAssignIssue();

  const options = (users ?? []).map((u) => ({
    value: u.id,
    label: u.name,
    email: u.email,
  }));

  const handleChange = (newAssigneeId: string | null) => {
    if (newAssigneeId !== assigneeId) {
      assignMutation.mutate({
        id: issueId,
        assigneeId: newAssigneeId,
      });
    }
  };

  return (
    <ComboboxField
      label="Assignee"
      value={assigneeId}
      onChange={handleChange}
      options={options}
      disabled={disabled || isPending || assignMutation.isPending}
      unassignedLabel="Unassigned"
      placeholder={isPending ? 'Loading users...' : 'Assign to...'}
    />
  );
}

