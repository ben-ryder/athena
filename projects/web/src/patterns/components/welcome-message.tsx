

export function WelcomeMessage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center text-br-whiteGrey-100 max-w-sm">
        <h1 className="font-bold text-3xl mb-2">Welcome to <span className="text-br-teal-600">Athena</span></h1>
        <p>A local-first notes, task list and reminders app.</p>
        <a className="underline hover:text-br-teal-600" href="https://github.com/Ben-Ryder/athena">Learn More</a>

        <div className="mt-5">
          <p className="text-br-red-500">This app is in development, expect bugs and incomplete functionality!</p>
        </div>

        <div className="mt-5">
          <p className="text-br-blueGrey-600">v0.1.0-alpha</p>
        </div>
      </div>
    </div>
  )
}