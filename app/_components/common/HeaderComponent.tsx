import { TUser } from '../../_libs/types'

type HeaderComponentProps = {
  user: TUser | null
}

const HeaderComponent = (props: HeaderComponentProps) => {
  const { user } = props

  return (
    <header className="shadow p-4 py-3 flex items-center bg-green-500">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        <img src={user?.pictureUrl} />
      </div>
      <h1 className="ml-4 text-lg text-white font-medium">{ user?.name }</h1>
    </header>
  )
}

export default HeaderComponent
