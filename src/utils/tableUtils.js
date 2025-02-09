export function renderCell(cell, rowIndex, cellIndex) {
  if (cellIndex === 0) {
    return (
      <div className='flex justify-center items-center h-full'>
        {cell ? (
          <span className='text-green-500 text-lg leading-none'>✔</span>
        ) : (
          ''
        )}
      </div>
    );
  }
  return cell;
}
