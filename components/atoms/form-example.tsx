import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { event, FormEvent } from './invitation-card'

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em>{field.state.meta.errors.join(', ')}</em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

type FormExampleProps = {
    onCallBack: (value: FormEvent) => void;
}

export default function FormExample({ onCallBack }: FormExampleProps) {
    const form = useForm({
        defaultValues: event,
        onSubmit: async ({ value }) => {
            onCallBack(value);
        },
    })

    return (
        <div className='w-full'>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className='w-full'
            >
                <div>
                    <form.Field
                        name="name"
                        validators={{
                            onChange: ({ value }) =>
                                !value
                                    ? 'A first name is required'
                                    : value.length < 3
                                        ? 'First name must be at least 3 characters'
                                        : undefined,
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: async ({ value }) => {
                                await new Promise((resolve) => setTimeout(resolve, 1000))
                                return (
                                    value.includes('error') && 'No "error" allowed in first name'
                                )
                            },
                        }}
                        children={(field) => {
                            return (
                                <>
                                    <div className="mb-2">
                                        <label htmlFor={field.name} className="block text-xs font-medium text-white mb-1">
                                            Họ và tên:
                                        </label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="text-sm w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                            placeholder="Nhập họ tên..."
                                        />
                                    </div>
                                    <FieldInfo field={field} />
                                </>
                            )
                        }}
                    />
                </div>
                <div>
                    <form.Field
                        name="field_one"
                        children={(field) => (
                            <>
                                <div className="mb-2">
                                    <label htmlFor={field.name} className="block text-xs font-medium text-white mb-1">
                                        Chức vụ:
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="text-sm w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                        placeholder="Nhập tên chức vụ..."
                                    />
                                </div>
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`
                                mt-4 px-6 py-2 rounded-md font-bold transition-all w-full cursor-pointer
                                ${canSubmit
                                    ? 'bg-white text-[#844d15] hover:bg-white/80 shadow-md backdrop-blur-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Tạo thiệp'}
                        </button>
                    )}
                />
            </form>
        </div>
    )
};
