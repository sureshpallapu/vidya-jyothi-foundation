function PrintRow({

  label,

  value,

}) {

  return (

    <tr>

      <td className="w-56 border border-black px-3 py-2 font-semibold">

        {label}

      </td>

      <td className="border border-black px-3 py-2">

        {value || "-"}

      </td>

    </tr>

  );

}

export default PrintRow;