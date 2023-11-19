import { TUser } from '../../_libs/types'

type HeaderComponentProps = {
  user: TUser
}

const HeaderComponent = (props: HeaderComponentProps) => {
  const { user } = props

  return (
    <header className="shadow p-4 py-3 flex items-center bg-green-500">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        <span className="text-sm text-white">画</span>
      </div>
      <h1 className="ml-4 text-lg text-white font-medium">{ user?.name }</h1>
    </header>
  )
}

export default HeaderComponent
