import { ControlledInput } from '@/components/common/controlled-input'
import { Button } from '@/components/ui/button'
import { useForm, useStore } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, Trash2, UserPen } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query'
import { getPackageItemList } from '@/api/select-options'
import { ControlledCountInput } from '@/components/common/controlled-count-input'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/_protected/package/add')({
    component: RouteComponent,
})

function RouteComponent() {

    const { Field, handleSubmit, Subscribe, reset, store, setFieldValue, getFieldValue } = useForm({
        onSubmit,
        defaultValues: { data: [] }
    })

    const packageItemList = useQuery(getPackageItemList())

    const itemFields = useStore(store, state => state.values.data)

    function onSubmit(value) {
        console.log(value.value)
    }

    if (packageItemList.isError)
        return null

    return <>
        <div className='h-full flex flex-col gap-y-6 overflow-hidden'>
            <div className="bg-white p-4 rounded-xl flex justify-end gap-x-4">
                <Button
                    type="button"
                    className="w-full max-w-[160px] py-2 text-base bg-sky-600 text-white"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSubmit()
                    }}
                >
                    Add
                </Button>
            </div>
            <div className='h-full flex flex-col gap-y-6 bg-white rounded-xl overflow-hidden'>
                <div className='p-6 pb-0 flex gap-x-2'>
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
                    <Field
                        name='data'
                        mode='array'
                        children={(field) => (
                            <Button type='button' className='px-3' onClick={() => field.pushValue({ pim_id: undefined, quantity: 1 })}>
                                <PlusCircle />
                            </Button>
                        )}
                    />
                </div>
                <ScrollArea className="px-3 pb-4 overflow-hidden">
                    <div className='w-full px-3 pb-3 grid grid-cols-3 gap-4 overflow-auto'>
                        {itemFields.map((item, index) => {
                            return (
                                <div key={item.id} className='flex border border-border-1 rounded-md'>
                                    <Field
                                        name={`data[${index}].pim_id`}
                                        children={(subField) => {
                                            return (
                                                <Select defaultValue={subField.state.value} onValueChange={value => subField.handleChange(value)}>
                                                    <SelectTrigger icon={false} className="w-full !h-auto border-border-1 gap-x-0 rounded-lg bg-transparent px-2 py-3 focus:ring-0 focus:ring-offset-0 border-none">
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
                                        }} />
                                    <Field
                                        name={`data[${index}].quantity`}
                                        children={(subField) => <ControlledCountInput min={1} max={99} value={subField.state.value} onChange={value => subField.handleChange(value)} />}
                                    />
                                    <Field
                                        name='data'
                                        mode='array'
                                        children={(field) => (
                                            <Button type='button'
                                                className='px-3 border-0 border-l rounded-l-none hover:bg-red-500 hover:border-red-500'
                                                onClick={() => field.removeValue(index)}
                                            >
                                                <Trash2 className='size-5' />
                                            </Button>
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>
        </div>
    </>
}
