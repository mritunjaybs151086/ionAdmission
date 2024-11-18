import React, { useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import UIButton from "./ui/Button";
// import { useTheme } from "../contexts/ThemeContext";

interface DataTableProps {
  columnDefs: any[];
  rowData: any[];
  pagination?: boolean;
  pageSize?: number;
  headerFilter?: boolean;
  showAddButton?: boolean;
  showAddButtonName?: string;
  showExportButton?: boolean;
  showExportButtonName?: string;
  showImportButton?: boolean;
  showExportCSVButton?: boolean;
  showSaveButton?: boolean;
  showSaveButtonName?: string;
  saveButtonHandler?: () => void;
  addButtonHandler?: () => void;
  importButtonHandler?: () => void;
  exportCSVButtonHandler?: () => void;
  autoGroupColumnDef?: any;
  singleClickEdit?: boolean;
  rowSelection?: any;
  onRowSelected?: (data: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  columnDefs,
  rowData,
  pagination = true,
  pageSize = 10,
  headerFilter = false,
  showAddButton = false,
  showAddButtonName,
  showExportButton = false,
  showExportButtonName,
  showImportButton = false,
  showExportCSVButton = false,
  showSaveButton = false,
  showSaveButtonName,
  addButtonHandler,
  importButtonHandler,
  exportCSVButtonHandler,
  saveButtonHandler,
  autoGroupColumnDef,
  singleClickEdit = false,
  rowSelection = "multiple",
  onRowSelected,
}) => {
  const gridRef = useRef<any>(null);
  // const { theme } = useTheme();
  // const theme = 'light';

  const [currentRowData, setCurrentRowData] = useState(rowData);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: headerFilter,
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      headerClass: "ag-header-cell-custom",
    };
  }, [headerFilter]);

  // const gridTheme = theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine";
  const gridTheme = "ag-theme-alpine";

  const handleRowSelected = (event: any) => {
    if (event.node) {
      const updatedRowData = currentRowData.map((row: any) => {
        if (row.id === event.node.data.id) {
          return {
            ...row,
            selected: event.node.isSelected(),
          };
        }
        return row;
      });

      setCurrentRowData(updatedRowData);
      if (onRowSelected) {
        onRowSelected(updatedRowData);
      }
    }
  };

  const onExportClick = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: "export.csv",
        columnKeys: columnDefs.filter((col) => col.field !== "action").map((col) => col.field),
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {showAddButton && (
            <UIButton type="button" variant="primary" size="sm" onClick={addButtonHandler}>
              {showAddButtonName ? showAddButtonName : "Add"}
            </UIButton>
          )}
          {showExportCSVButton && (
            <UIButton type="button" variant="secondary" size="sm" onClick={exportCSVButtonHandler}>
              Export CSV
            </UIButton>
          )}
          {showImportButton && (
            <UIButton type="button" variant="secondary" size="sm" onClick={importButtonHandler}>
              Import
            </UIButton>
          )}
          {showExportButton && (
            <UIButton type="button" variant="secondary" size="sm" onClick={onExportClick}>
              {showExportButtonName ? showExportButtonName : "Export data"}
            </UIButton>
          )}
          {showSaveButton && (
            <UIButton type="button" variant="secondary" size="sm" onClick={saveButtonHandler}>
              {showSaveButtonName ? showSaveButtonName : "Save Data"}
            </UIButton>
          )}
        </div>
      </div>
      <div
        className={`${gridTheme} rounded-lg overflow-hidden border border-border-light dark:border-border-dark w-full`}
        style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={currentRowData}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={pageSize}
          headerHeight={48}
          domLayout="normal"
          rowSelection={rowSelection}
          onRowSelected={handleRowSelected}
          rowHeight={35}
          suppressRowHoverHighlight={true}
          singleClickEdit={singleClickEdit}
          rowStyle={{
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default DataTable;
