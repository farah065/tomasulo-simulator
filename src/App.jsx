import "./App.css";
import { Button } from "./components/ui/button";

function App() {
    return (
        <div className="w-screen min-h-screen flex justify-center items-center">
            <Button variant="default" size="default" onClick={() => alert("Hello, world!")}>
                Test
            </Button>
        </div>
    )
}

export default App
