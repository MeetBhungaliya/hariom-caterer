import { ControlledInput } from '@/components/common/controlled-input'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, UserPen } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query'
import { getPackageItemList } from '@/api/select-options'

export const Route = createFileRoute('/_protected/package/add')({
    component: RouteComponent,
})

function RouteComponent() {

    const { Field, handleSubmit, Subscribe, reset, store, setFieldValue, getFieldValue } = useForm({
        onSubmit,
        defaultValues: { data: [] }
    })

    const packageItemList = useQuery(getPackageItemList())

    function onSubmit() { }

    if (packageItemList.isError)
        return null

    return <>
        <div className='h-full flex flex-col gap-y-6 overflow-hidden'>
            <div className="bg-white p-4 rounded-xl flex justify-end gap-x-4">
                <Button
                    type="button"
                    className="w-full max-w-[160px] py-2 text-base bg-sky-600 text-white"
                    disabled
                >
                    Add
                </Button>
            </div>
            <div className='h-full p-6 flex flex-col gap-y-6 bg-white rounded-xl overflow-hidden'>
                <div className='pt-1 flex gap-x-2'>
                    <Field
                        name="name"
                        children={field => (
                            <ControlledInput
                                id="name"
                                label="Item name"
                                containerClassName="w-full max-w-sm"
                                field={field}
                                prefix={<UserPen className="size-5" />}
                            />
                        )}
                    />
                    <Button type='button' className='px-3' onClick={() => setFieldValue("data", [...getFieldValue("data"), { id: Date.now() }])}>
                        <PlusCircle />
                    </Button>
                </div>
                <div>
                    <Field
                        name="data"
                        children={field => {
                            if (!field.state.value.length) return null
                            return (
                                <div className='h-full grid grid-cols-3 gap-4'>
                                    {field.state.value.map(item => {
                                        return (
                                            <Select key={item.id}>
                                                <SelectTrigger className="w-full !h-auto border-border-1 gap-x-0 rounded-lg bg-transparent px-2 py-3 focus:ring-0 focus:ring-offset-0">
                                                    <SelectValue placeholder="Select package item" className="text-text-2 text-sm" />
                                                </SelectTrigger>
                                                <SelectContent align="middle" className="min-w-20">
                                                    {packageItemList.data.result.list.map((item, key) => (
                                                        <SelectItem key={key} value={item.pim_id}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )
                                    })}
                                </div>
                            )
                        }}
                    />
                </div>
            </div>
        </div>
    </>
}
