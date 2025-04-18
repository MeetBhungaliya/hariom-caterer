import { useSidebar } from '@/components/ui/sidebar'
import { paginationSchema } from '@/lib/schema/common'
import { sleep } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { ClientSideRowModelModule, ColumnAutoSizeModule, GridStateModule, ModuleRegistry, PaginationModule, ValidationModule } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'

ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule, ColumnAutoSizeModule, PaginationModule, GridStateModule])

export const Route = createFileRoute('/_protected/')({
  component: Index,
  validateSearch: search => paginationSchema.parse(search),
})

const d = [
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'ALTO', model: 'Corolla', price: 29600, electric: false },
]

function Index() {
  const sidebarState = useSidebar()
  const tableRef = useRef(null)

  const [rowData, setRowData] = useState([...Array.from({ length: 10 })])

  const fetchNDSetData = async () => {
    await sleep(2000)
    setRowData(d)
  }

  useEffect(() => {
    fetchNDSetData()
  }, [])

  const [colDefs] = useState([
    {
      field: 'make',
      cellRenderer: (params) => {
        if (!('value' in params) || params.value === undefined) {
          return <div className="w-full h-full animate-pulse bg-gray-300 rounded-xl" />
        }
        return params.value
      },
    },
    {
      field: 'model',
      cellRenderer: (params) => {
        if (!('value' in params) || params.value === undefined) {
          return <div className="w-full h-full animate-pulse bg-gray-300 rounded-xl" />
        }
        return params.value
      },
    },
    {
      field: 'price',
      cellRenderer: (params) => {
        if (!('value' in params) || params.value === undefined) {
          return <div className="w-full h-full animate-pulse bg-gray-300 rounded-xl" />
        }
        return params.value
      },
    },
    {
      field: 'electric',
      cellRenderer: (params) => {
        if (!('value' in params) || params.value === undefined) {
          return <div className="w-full h-full animate-pulse bg-gray-300 rounded-xl" />
        }
        return 'params.value'
      },
    },
  ])

  const resizeGrid = (api) => {
    api.sizeColumnsToFit()
  }

  useEffect(() => {
    if (!tableRef.current?.api)
      return
    resizeGrid(tableRef.current?.api)
  }, [sidebarState.open])

  return (
    <div className="h-full transition-all duration-300">
      <AgGridReact
        ref={tableRef}
        rowData={rowData}
        columnDefs={colDefs}
        // onGridReady={params => resizeGrid(params.api)}
        initialState={{
          pagination: {
            page: 2,
            pageSize: 5,
          },
        }}
        gridOptions={{
          suppressCellFocus: true,
          onFirstDataRendered: params => params.api.sizeColumnsToFit(),
          onGridSizeChanged: params => params.api.sizeColumnsToFit(),
        }}
        defaultColDef={{
          cellRenderer: (params) => {
            console.log(params)
            return 'Rahul'
          },
          resizable: false,
          suppressSizeToFit: false,
        }}
        loadThemeGoogleFonts={true}
        suppressMovableColumns={true}
        suppressHeaderFocus={true}
        suppressRowDrag={true}
        pagination
        paginationPageSize={5}
        paginationPageSizeSelector={[5, 10, 15, 20, 25]}

      />
    </div>
  )
}
