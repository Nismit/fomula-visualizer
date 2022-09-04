import { usePlot } from "./hooks";
import { PlotCanvas } from "./components/PlotCanvas";
import { FomulaField } from "./components/FomulaField";
import { MessageBox } from "./components/MessageBox";
import { Footer } from "./components/Footer";

export default function App() {
  const {
    canvasRef,
    fomula,
    isCompiling,
    status,
    handleChangeText,
    onCompile,
  } = usePlot();

  return (
    <div className="App">
      <PlotCanvas ref={canvasRef} />

      <FomulaField value={fomula} onChange={handleChangeText} />

      <div>
        <button onClick={onCompile}>
          {isCompiling ? "Compiling..." : "Compile"}
        </button>
        &nbsp;
        {status && status}
      </div>

      <MessageBox />

      <Footer />
    </div>
  );
}
