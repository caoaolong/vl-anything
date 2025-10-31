```mermaid
graph LR;
DataCell("DataCell")-->Type("Type<br/>[data-cell-type]")
Type-->Button("Button<br/>[button]")
Type-->Popup("Popup<br/>[popup]")
Type-->Dialog("Dialog<br/>[dialog]")
DataCell-->ID("ID<br/>[data-cell-id]")
```