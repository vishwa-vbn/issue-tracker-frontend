import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/controls/text-field';
import { TextAreaField } from '@/components/controls/text-area-field';
import { SelectField } from '@/components/controls/select-field';
import { ComboboxField } from '@/components/controls/combobox-field';
import { ActionButton } from '@/components/controls/action-button';
import { issueFormSchema, type IssueFormValues } from '../schemas';
import { useAssignableUsers } from '@/features/users/hooks/use-assignable-users';
import { applyApiErrors } from '@/helpers/error-messages';
import { ISSUE_PRIORITY, PRIORITY_LABELS, ROUTES } from '@/constants';

interface IssueFormProps {
  initialValues?: Partial<IssueFormValues>;
  onSubmit: (values: IssueFormValues) => Promise<unknown> | void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelTo?: string;
}

export function IssueForm({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Issue',
  cancelTo = ROUTES.ISSUES,
}: IssueFormProps) {
  const navigate = useNavigate();
  const { data: assignableUsers, isPending: isUsersPending } = useAssignableUsers();

  const { control, handleSubmit, setError } = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      priority: initialValues?.priority ?? 'MEDIUM',
      assigneeId: initialValues?.assigneeId ?? null,
    },
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      applyApiErrors(err, setError);
    }
  });

  const priorityOptions = [
    { value: ISSUE_PRIORITY.LOW, label: PRIORITY_LABELS.LOW },
    { value: ISSUE_PRIORITY.MEDIUM, label: PRIORITY_LABELS.MEDIUM },
    { value: ISSUE_PRIORITY.HIGH, label: PRIORITY_LABELS.HIGH },
    { value: ISSUE_PRIORITY.CRITICAL, label: PRIORITY_LABELS.CRITICAL },
  ];

  const assigneeOptions = (assignableUsers ?? []).map((u) => ({
    value: u.id,
    label: u.name,
    email: u.email,
  }));

  return (
    <Card className="border-border shadow-sm max-w-3xl">
      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Issue Title"
                placeholder="e.g., Safari login button unresponsive on iOS 18"
                error={fieldState.error?.message}
                hint="Be specific and concise"
                autoFocus
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <TextAreaField
                {...field}
                label="Description & Steps to Reproduce"
                placeholder="Provide detailed description, steps to reproduce, expected vs actual behavior..."
                rows={6}
                maxLength={5000}
                error={fieldState.error?.message}
              />
            )}
          />

          {/* Priority & Assignee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <SelectField
                  label="Priority Level"
                  value={field.value}
                  onChange={field.onChange}
                  options={priorityOptions}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="assigneeId"
              control={control}
              render={({ field, fieldState }) => (
                <ComboboxField
                  label="Assignee (Optional)"
                  value={field.value ?? null}
                  onChange={field.onChange}
                  options={assigneeOptions}
                  disabled={isUsersPending}
                  placeholder={isUsersPending ? 'Loading users...' : 'Select team member...'}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(cancelTo)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <ActionButton type="submit" isLoading={isLoading} className="font-semibold">
              {submitLabel}
            </ActionButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

