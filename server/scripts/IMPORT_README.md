# Location Data Import Instructions

## Steps to Import Excel Data

### 1. Place Your Excel File
Put your Excel file named `locations.xlsx` in the `server/scripts/` folder.

### 2. Excel File Format
Your Excel file should have these columns:
- **State** (or state/STATE)
- **District** (or district/DISTRICT)
- **Block** (or block/BLOCK)

Example:
```
State           | District      | Block
Tamil Nadu      | Chennai       | Alandur
Tamil Nadu      | Chennai       | Ambattur
Tamil Nadu      | Coimbatore    | Annur
```

### 3. Run the Import Script
```bash
cd server
node scripts/import-locations.js
```

### 4. Verify Import
The script will show:
- ✅ Number of states imported
- ✅ Number of districts imported
- ✅ Total blocks imported
- ✅ Sample data

### 5. Test the APIs

**Get all states:**
```
GET http://localhost:4000/api/locations/states
```

**Get districts for a state:**
```
GET http://localhost:4000/api/locations/states/Tamil Nadu/districts
```

**Get blocks for a district:**
```
GET http://localhost:4000/api/locations/states/Tamil Nadu/districts/Chennai/blocks
```

## Database Collection
Data is stored in MongoDB:
- **Database**: activ-db
- **Collection**: locations
- **Schema**: { state, district, blocks: [] }

## Notes
- The import script will clear existing location data before importing
- Blocks are automatically deduplicated for each state-district combination
- Data is sorted alphabetically for easy navigation
