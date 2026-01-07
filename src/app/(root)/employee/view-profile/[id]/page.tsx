

export default async function EmployeeProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return(
    <>
     <div>
        Empyloyee: {id}
     </div>
     </>
  )
}