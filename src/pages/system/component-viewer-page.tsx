import { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TextField } from '@/components/controls/text-field';
import { TextAreaField } from '@/components/controls/text-area-field';
import { SelectField } from '@/components/controls/select-field';
import { ComboboxField } from '@/components/controls/combobox-field';
import { ActionButton } from '@/components/controls/action-button';
import { StatusBadge } from '@/components/controls/status-badge';
import { PriorityBadge } from '@/components/controls/priority-badge';
import { UserAvatar } from '@/components/controls/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Pagination } from '@/components/common/pagination';
import { CardSkeleton, TableSkeleton } from '@/components/common/skeleton-loader';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ComponentViewerPage() {
  const [text, setText] = useState('');
  const [textarea, setTextarea] = useState('Sample text in textarea');
  const [selectVal, setSelectVal] = useState('opt1');
  const [comboboxVal, setComboboxVal] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [demoPage, setDemoPage] = useState(1);

  const demoUsers = [
    { value: 'u1', label: 'Jane Doe', email: 'jane@example.com' },
    { value: 'u2', label: 'Demo User', email: 'demo.user@example.com' },
    { value: 'u3', label: 'System Admin', email: 'admin@example.com' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in-50">
      <PageHeader
        title="UI Component Gallery"
        subtitle="Catalog and live sandbox of all Tier 2 controls and Tier 3 common components"
      />

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Badges (Status & Priority)</CardTitle>
          <CardDescription>Semantic, accessible badge variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground w-20">Status:</span>
            <StatusBadge status="OPEN" />
            <StatusBadge status="IN_PROGRESS" />
            <StatusBadge status="CLOSED" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground w-20">Priority:</span>
            <PriorityBadge priority="LOW" />
            <PriorityBadge priority="MEDIUM" />
            <PriorityBadge priority="HIGH" />
            <PriorityBadge priority="CRITICAL" />
          </div>
        </CardContent>
      </Card>

      {/* Avatars Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">User Avatars</CardTitle>
          <CardDescription>Dynamic color deterministic hashing and size variants</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <UserAvatar name="Small User" size="sm" />
            <span className="text-xs text-muted-foreground">sm (24px)</span>
          </div>
          <div className="flex items-center gap-2">
            <UserAvatar name="Medium User" size="md" />
            <span className="text-xs text-muted-foreground">md (32px)</span>
          </div>
          <div className="flex items-center gap-2">
            <UserAvatar name="Large User" size="lg" />
            <span className="text-xs text-muted-foreground">lg (40px)</span>
          </div>
        </CardContent>
      </Card>

      {/* Buttons & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Action Buttons & Toast Triggers</CardTitle>
          <CardDescription>All loading, disabled, and style variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <ActionButton onClick={() => toast.success('Operation succeeded!')}>
            Default Primary
          </ActionButton>
          <ActionButton variant="secondary">Secondary</ActionButton>
          <ActionButton variant="outline">Outline</ActionButton>
          <ActionButton variant="ghost">Ghost</ActionButton>
          <ActionButton variant="destructive">Destructive</ActionButton>
          <ActionButton isLoading>Loading State</ActionButton>
          <ActionButton disabled>Disabled</ActionButton>
          <ActionButton onClick={() => setShowConfirm(true)} variant="outline">
            Open Confirm Dialog
          </ActionButton>
        </CardContent>
      </Card>

      {/* Form Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Form Input Controls</CardTitle>
          <CardDescription>Validated input wrappers with error and hint messaging</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Standard Text Field"
            placeholder="Type something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            hint="This is a helpful hint"
          />

          <TextField
            label="With Icon Prefix"
            placeholder="search..."
            prefixIcon={<Search className="size-4" />}
          />

          <TextField
            label="Password Field with Toggle"
            type="password"
            defaultValue="Secret123"
          />

          <TextField
            label="Field with Error"
            defaultValue="Invalid input"
            error="This value is unacceptable according to validation rules"
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Text Area with Character Counter"
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
              maxLength={200}
            />
          </div>

          <SelectField
            label="Select Dropdown"
            value={selectVal}
            onChange={setSelectVal}
            options={[
              { value: 'opt1', label: 'Option One' },
              { value: 'opt2', label: 'Option Two' },
              { value: 'opt3', label: 'Option Three' },
            ]}
          />

          <ComboboxField
            label="Combobox Assignee Picker"
            value={comboboxVal}
            onChange={setComboboxVal}
            options={demoUsers}
          />
        </CardContent>
      </Card>

      {/* Pagination Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pagination Component</CardTitle>
          <CardDescription>Responsive page numbers and record summary</CardDescription>
        </CardHeader>
        <CardContent>
          <Pagination
            page={demoPage}
            totalPages={8}
            totalItems={75}
            limit={10}
            onPageChange={setDemoPage}
          />
        </CardContent>
      </Card>

      {/* States (Empty & Error & Skeletons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmptyState
          title="Empty State Example"
          description="Rendered when search returns zero rows or no items exist"
          action={<ActionButton size="sm">Action</ActionButton>}
        />

        <ErrorState
          message="Failed to connect to backend cluster. Retrying with exponential backoff."
          onRetry={() => toast.info('Retry clicked')}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Skeleton Loaders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardSkeleton count={2} />
          <TableSkeleton rows={3} cols={4} />
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Component Viewer Confirmation"
        description="This is an accessible Radix Alert Dialog used across destructive operations in the system."
        confirmText="Confirm Action"
        isLoading={confirmLoading}
        onConfirm={() => {
          setConfirmLoading(true);
          setTimeout(() => {
            setConfirmLoading(false);
            setShowConfirm(false);
            toast.success('Confirmed action successfully!');
          }, 800);
        }}
      />
    </div>
  );
}
