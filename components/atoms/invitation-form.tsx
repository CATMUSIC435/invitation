import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import type { AnyFieldApi } from '@tanstack/react-form';
import { InvitationFormData, defaultFormData } from '@/lib/store/useInvitationStore';

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="min-h-[20px] mt-1 text-red-300 text-xs italic">
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <span>{field.state.meta.errors.join(', ')}</span>
      ) : null}
    </div>
  );
}

type InvitationFormProps = {
  onCallBack: (value: InvitationFormData) => void;
};

export default function InvitationForm({ onCallBack }: InvitationFormProps) {
  const form = useForm({
    defaultValues: {
      ...defaultFormData,
      role: (defaultFormData?.title || '').split('\n')[0] || '',
      company: (defaultFormData?.title || '').split('\n').slice(1).join('\n') || '',
    },
    onSubmit: async ({ value }) => {
      onCallBack({
        ...value,
        title: [value.role, value.company].filter(Boolean).join('\n')
      });
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="w-full"
      >
        <div className="mb-2">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'Vui lòng nhập họ và tên'
                  : value.length < 2
                    ? 'Tên phải có ít nhất 2 ký tự'
                    : undefined,
            }}
            children={(field) => (
              <>
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-white mb-1.5">
                    Họ và tên:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                    placeholder="Nhập họ và tên..."
                  />
                </div>
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        <div className="mb-2 flex flex-col gap-4">
          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Vui lòng nhập chức vụ' : undefined,
            }}
            children={(field) => (
              <>
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-white mb-1.5">
                    Chức vụ:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                    placeholder="Nhập chức vụ (VD: Tổng Giám Đốc)"
                  />
                </div>
                <FieldInfo field={field} />
              </>
            )}
          />

          <form.Field
            name="company"
            children={(field) => (
              <>
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-white mb-1.5">
                    Tên Đơn vị/Công ty:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                    placeholder="Nhập công ty (Tùy chọn)"
                  />
                </div>
              </>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => state.values}
          children={(values) => {
            React.useEffect(() => {
              onCallBack({
                name: values.name,
                title: [values.role, values.company].filter(Boolean).join('\n')
              });
            }, [values.name, values.role, values.company]);
            return null;
          }}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                px-6 py-3 rounded-lg font-bold transition-all w-full
                ${canSubmit
                  ? 'bg-white text-[#0e1e2e] hover:bg-gray-100 shadow-lg hover:shadow-xl active:scale-[0.98]'
                  : 'bg-white/30 text-white/50 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo thư'}
            </button>
          )}
        />
      </form>
    </div>
  );
}
