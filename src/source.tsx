import React from "react"
import * as grafanaRuntime from '@grafana/runtime';
import * as grafanaData from "@grafana/data"
import { tw } from 'twind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
const render = (fc: React.JSX.Element) => { }
declare const data: grafanaData.PanelData

// Do not remove the below comment
// <- Start Here ->

type APIResponseType = {
    elementName: string
    value: {
      status: number
      timestamp: string
      value: string | number
    }
  }
  
  interface DropdownOption {
    uid: number;
    label: string;
  }
  
  interface DropdownMenuProps {
    options: DropdownOption[];
    selectedOption: DropdownOption | null;
    onOptionSelect: (option: DropdownOption) => void;
    defaultOption: DropdownOption;
  }
  
  const DropdownMenu: React.FC<DropdownMenuProps> = ({
    options,
    selectedOption,
    onOptionSelect,
    defaultOption,
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (option: DropdownOption) => {
      onOptionSelect(option);
      setIsOpen(false);
    };
  
    return (
      <div className={tw`relative inline-block text-left`}>
        <button onClick={toggleDropdown} className={tw`px-4 py-1 text-sm text-gray-700 flex items-center`}>
          {selectedOption ? selectedOption.label : defaultOption.label}
          <FontAwesomeIcon className={tw`px-2 text-sm cursor-pointer`} icon={icons.faChevronDown} />
        </button>
        {isOpen && (
          <div className={tw`origin-top-right z-10 absolute right-0 w-32 rounded-md shadow-lg bg-white`}>
            <div>
              {options.map((option) => (
                <button
                  key={option.uid}
                  onClick={() => handleOptionClick(option)}
                  className={tw`block w-full px-2 p-1 text-sm text-gray-700 hover:bg-gray-100`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const Editable = ({ value, handleChange, editmode, className }: { value: string | number, handleChange: (value: string) => void, editmode: boolean, className?: string }) => {
    const defaultClassName = tw`!w-full text-center`
    const combinedClassName = className ? `${className} ${defaultClassName}` : defaultClassName
    return editmode ? <div className='w-full'> <input className={combinedClassName} value={value} onChange={(event) => handleChange(event.target.value)} type="text" /> </div> : <p className={combinedClassName}> {value} </p>
  }
  
  type tableItemType = {
    type: string
    item: number
    min: string
    max: string
    value: string
  }
  
  type plcItemType = {
    label: string,
    agent: string,
    value: any
  }
  
  const useMinMaxPercentage = (setData: React.Dispatch<React.SetStateAction<tableItemType[]>>, setPlcData: React.Dispatch<React.SetStateAction<tableItemType[]>>, minMax: string, plcMode: boolean) => {
    React.useEffect(() => {
      const minMaxValue = parseInt(minMax);
      const dispatcher = plcMode ? setPlcData : setData
      if (!isNaN(minMaxValue)) {
        dispatcher((prevData) =>
          prevData.map((item) => {
            const value = parseInt(item.value);
            if (!isNaN(value)) {
              const calculatedMin = value - (value * (minMaxValue / 100));
              const calculatedMax = value + (value * (minMaxValue / 100));
              return { ...item, min: !isNaN(calculatedMin) ? calculatedMin.toString() : item.min, max: !isNaN(calculatedMax) ? calculatedMax.toString() : item.max };
            }
            return item;
          })
        );
      }
    }, [minMax, plcMode]);
  };
  
  function App() {
    const process: plcItemType[] = [
      {
        label: "Bottom Core water Temp SP",
        agent: "TC1_B_CORE_WATER",
        value: null
      }, {
        label: "Side Core water Temp SP",
        agent: "TC2_S_CORE_WATER",
        value: null
      }, {
        label: "Metal Temp SP",
        agent: "METAL_TEMP",
        value: null
      }, {
        label: "Air Temp SP",
        agent: "AIR_TEMP",
        value: null
      }, {
        label: "Spure Bush Temp SP",
        agent: "SPRUE_BUSH_TEMP",
        value: null
      }
    ]
    const plcCurrent: plcItemType[] = [
      {
        label: "PLC Current Recipe",
        agent: "ARTICLE_NUMBER",
        value: null
      },
      {
        label: "PLC Current Die",
        agent: "MOLD_NUMBER",
        value: null
      },
    ]
    const controlType = [
      { uid: 0, label: "Open" },
      { uid: 1, label: "Time" },
      { uid: 2, label: "Temp" },
      { uid: 3, label: "Close" },
    ];
    const moldLink = [
      { uid: 0, label: "None" },
      { uid: 1, label: "TOP R1" },
      { uid: 2, label: "TOP R2" },
      { uid: 3, label: "TOP R3" },
      { uid: 4, label: "TOP R4" },
      { uid: 5, label: "TOP R5" },
      { uid: 6, label: "TOP R6" },
      { uid: 7, label: "TOP R7" },
      { uid: 8, label: "TOP R8" },
      { uid: 9, label: "BOT R1" },
      { uid: 10, label: "BOT R2" },
      { uid: 11, label: "BOT R3" },
      { uid: 12, label: "BOT R4" },
      { uid: 13, label: "BOT R5" },
      { uid: 14, label: "BOT R6" },
      { uid: 15, label: "BOT R7" },
      { uid: 16, label: "BOT R8" },
    ];
    const [airTable, setAirTable] = React.useState<tableItemType[]>([])
    const [waterTable, setWaterTable] = React.useState<tableItemType[]>([])
    const [airTimeOn, setAirTimeOn] = React.useState<tableItemType[]>([])
    const [airDuration, setAirDuration] = React.useState<tableItemType[]>([])
    const [airFlowSP, setAirFlowSP] = React.useState<tableItemType[]>([])
    const [waterTimeOn, setWaterTimeOn] = React.useState<tableItemType[]>([])
    const [waterDuration, setWaterDuration] = React.useState<tableItemType[]>([])
    const [waterFlowSP, setWaterFlowSP] = React.useState<tableItemType[]>([])
    const [plcAirTable, plcSetAirTable] = React.useState<tableItemType[]>([])
    const [plcWaterTable, plcSetWaterTable] = React.useState<tableItemType[]>([])
    const [plcAirTimeOn, plcSetAirTimeOn] = React.useState<tableItemType[]>([])
    const [plcAirDuration, plcSetAirDuration] = React.useState<tableItemType[]>([])
    const [plcAirFlowSP, plcSetAirFlowSP] = React.useState<tableItemType[]>([])
    const [plcWaterTimeOn, plcSetWaterTimeOn] = React.useState<tableItemType[]>([])
    const [plcWaterDuration, plcSetWaterDuration] = React.useState<tableItemType[]>([])
    const [plcWaterFlowSP, plcSetWaterFlowSP] = React.useState<tableItemType[]>([])
    const [sampleMode, setSampleMode] = React.useState(false)
    const [plcMode, setPlcMode] = React.useState(false)
    const [airCurrentControlType, setAirCurrentControlType] = React.useState<DropdownOption[]>([])
    const [airCurrentMoldLink, setAirCurrentMoldLink] = React.useState<DropdownOption[]>([])
    const [waterCurrentControlType, setWaterCurrentControlType] = React.useState<DropdownOption[]>([])
    const [waterCurrentMoldLink, setWaterCurrentMoldLink] = React.useState<DropdownOption[]>([])
    const [processTable, setProcessTable] = React.useState(process)
    const [plcCurrentData, setPlcCurrentData] = React.useState<plcItemType[]>(plcCurrent)
    const [editmode, setEditmode] = React.useState(false)
    const [airTimeOnMinMax, setAirTimeOnMinMax] = React.useState("0")
    const [airDurationMinMax, setAirDurationMinMax] = React.useState("0")
    const [airFlowSPMinMax, setAirFlowSPMinMax] = React.useState("0")
    const [waterTimeOnMinMax, setWaterTimeOnMinMax] = React.useState("0")
    const [waterDurationMinMax, setWaterDurationMinMax] = React.useState("0")
    const [waterFlowSPMinMax, setWaterFlowSPMinMax] = React.useState("0")
  
    const filterTables = () => {
      if (airTable.length) {
        setAirTimeOn(airTable.filter(row => row.type === "Time On"))
        setAirDuration(airTable.filter(row => row.type === "Duration"))
        setAirFlowSP(airTable.filter(row => row.type === "Flow SP"))
      }
      if (waterTable.length) {
        setWaterTimeOn(waterTable.filter(row => row.type === "Time On"))
        setWaterDuration(waterTable.filter(row => row.type === "Duration"))
        setWaterFlowSP(waterTable.filter(row => row.type === "Flow SP"))
      }
    }
  
    React.useEffect(() => {
      if (data.state === "Done") {
        console.log(data.series)
        const tempAirTable: tableItemType[] = []
        const tempWaterTable: tableItemType[] = []
        const plcTempAirTable: tableItemType[] = []
        const plcTempWaterTable: tableItemType[] = []
        data.series.forEach(set => {
          if (set.refId === "Sample Mode") {
            const result: APIResponseType[] = JSON.parse((set.fields[0].values as any).buffer[0])
            // setSampleMode(result[0].value.value ? true : false)
          }
          else if (set.refId === "PLC Current") {
            const result: APIResponseType[] = JSON.parse((set.fields[0].values as any).buffer[0])
            setPlcCurrentData(prev => prev.map(p => {
              const found = result.find(r => r.elementName.includes(p.agent))!
              return ({ ...p, value: found?.value.value })
            }))
          }
          else if (set.refId === "PLC Process") {
            const result: APIResponseType[] = JSON.parse((set.fields[0].values as any).buffer[0])
            console.log(result)
            setProcessTable(prev => prev.map(p => {
              const found = result.find(r => r.elementName.includes(p.agent))
              return ({ ...p, value: found?.value.value })
            }))
          }
          else if (set.refId === "PLC Air Table" || set.refId === "PLC Water Table") {
            const plcData: APIResponseType[] = JSON.parse((set.fields[0].values as any).buffer[0])
            const dispatcher = set.refId === "PLC Air Table" ? plcSetAirTable : plcSetWaterTable
            const targetTable = set.refId === "PLC Air Table" ? plcTempAirTable : plcTempWaterTable
            plcData.forEach(row => {
              const parts = row.elementName.split("_")
              const type = parts.includes("TIME") && parts.includes("ON") ? "Time On" : parts.includes("TIME") ? "Duration" : "Flow SP"
              const item = parseInt(((parts.find(part => part.startsWith("AIR") || part.startsWith("WATER")))!).match(/(AIR|WATER)(\d+)/)![2])
              const metric = row.elementName.endsWith("rowMin") ? "min" : row.elementName.endsWith("rowMax") ? "max" : "value"
              const existingData = targetTable.find(data => data.item === item && data.type === type);
              if (existingData) {
                existingData[metric] = row.value.value.toString();
              } else {
                const newData: tableItemType = {
                  type: type,
                  item: item,
                  min: "",
                  max: "",
                  value: "",
                  [metric]: row.value.value.toString() || " ",
                };
                targetTable.push(newData);
              }
            })
            dispatcher(targetTable.filter(({ item }) => item !== null && item !== undefined).sort((a, b) => a.item - b.item))
          }
          else if (set.refId === "Air Table" || set.refId === "Water Table") {
              const dispatcher = set.refId === "Air Table" ? setAirTable : setWaterTable
              const targetTable = set.refId === "Air Table" ? tempAirTable : tempWaterTable
              set.fields.forEach(field => {
                const fieldName = field.name;
                const value = (field.values as any).buffer[0];
                const parts = fieldName.split('_');
                const type = parts.includes("Time") ? "Time On" : parts.includes("Flow") ? "Flow SP" : "Duration";
                const item = parts.find(part => !isNaN(parseInt(part))) || "NaN";
                const metric = parts.includes("Min") ? "min" : parts.includes("Max") ? "max" : "value";
                const existingData = targetTable.find(data => data.item === parseInt(item) && data.type === type);
                if (existingData) {
                  existingData[metric] = value;
                } else {
                  const newData: tableItemType = {
                    type: type,
                    item: parseInt(item),
                    min: "",
                    max: "",
                    value: "",
                    [metric]: value || " ",
                  };
                  targetTable.push(newData);
                }
              })
              dispatcher(targetTable.filter(({ item }) => item !== null && item !== undefined).sort((a, b) => a.item - b.item))
            }
        })
      }
    }, [data])
    React.useEffect(() => {
      filterTables()
    }, [airTable, waterTable])
    React.useEffect(() => {
      if (airTimeOn.length) {
        setAirCurrentControlType(Array(airTimeOn.length).fill(controlType[0]))
        setAirCurrentMoldLink(Array(airTimeOn.length).fill(moldLink[0]))
      }
      if (waterTimeOn.length) {
        setWaterCurrentControlType(Array(waterTimeOn.length).fill(controlType[0]))
        setWaterCurrentMoldLink(Array(waterTimeOn.length).fill(moldLink[0]))
      }
    }, [airTimeOn, waterTimeOn])
    React.useEffect(() => {
      if (plcAirTable.length) {
        plcSetAirTimeOn(plcAirTable.filter(row => row.type === "Time On"))
        plcSetAirDuration(plcAirTable.filter(row => row.type === "Duration"))
        plcSetAirFlowSP(plcAirTable.filter(row => row.type === "Flow SP"))
      }
      if (plcWaterTable.length) {
        plcSetWaterTimeOn(plcWaterTable.filter(row => row.type === "Time On"))
        plcSetWaterDuration(plcWaterTable.filter(row => row.type === "Duration"))
        plcSetWaterFlowSP(waterTable.filter(row => row.type === "Flow SP"))
      }
    }, [plcAirTable, plcWaterTable])
  
    useMinMaxPercentage(setAirTimeOn, plcSetAirTimeOn, airTimeOnMinMax, plcMode)
    useMinMaxPercentage(setAirDuration, plcSetAirDuration, airDurationMinMax, plcMode)
    useMinMaxPercentage(setAirFlowSP, plcSetAirFlowSP, airFlowSPMinMax, plcMode)
    useMinMaxPercentage(setWaterTimeOn, plcSetWaterTimeOn, waterTimeOnMinMax, plcMode)
    useMinMaxPercentage(setWaterDuration, plcSetWaterDuration, waterDurationMinMax, plcMode)
    useMinMaxPercentage(setWaterFlowSP, plcSetWaterFlowSP, waterFlowSPMinMax, plcMode)
  
    const handleChange = (dispatcher: React.Dispatch<React.SetStateAction<tableItemType[]>>, field: tableItemType, value: string, metric: string) => {
      dispatcher(prev => prev.map(p => p.item === field.item && p.type === field.type ? ({ ...p, [metric]: value }) : p))
    }
    const cancelEdit = () => {
      filterTables()
      setEditmode(false)
    }
  
    return (
      <div className='bg-blue-200 flex flex-col gap-4 p-4'>
        {/* <Graph /> */}
        <div className={tw`flex gap-4 p-4 text-black justify-around text-center`}>
          <div className={tw`bg-blue-300 w-[200px] flex-auto p-1 flex flex-col gap-2`}>
            <div className={tw`flex flex-col gap-1`}>
              <p className={tw`bg-gray-200 p-1 cursor-pointer`}> <a href="https://pna-grafana.maxionwheels.com:3000/d/0RGoeegSz/add-wheel?orgId=1"> Add Wheel </a> </p>
              <p onClick={() => setEditmode(true)} className={tw`bg-purple-400 p-1 cursor-pointer`}> Edit Recipe </p>
              <p className={tw`bg-red-400 p-1 cursor-pointer`}> Delete Recipe </p>
              <p className={tw`bg-gray-200 p-1 cursor-pointer`}> <a href="https://pna-grafana.maxionwheels.com:3000/d/AoC6ThiIk/recipe-view?orgId=1"> Recipe View </a></p>
              { editmode && <p onClick={cancelEdit} className={tw`bg-red-400 p-1 cursor-pointer`}> Cancel Edit Mode </p> }
            </div>
            <div className={tw`flex justify-center gap-1`}>
              <div className={tw`flex flex-col w-3/4`}>
                {plcCurrentData.map(({ label, value }, key) => <div key={key} className={tw`flex gap-2 p-1 justify-between`}>
                  <p className={tw`p-1`}> {label} </p>
                  <p className={tw`py-1 px-2 bg-gray-200 w-12`}> {value} </p>
                </div>)}
              </div>
            </div>
            {
              <div className={tw`flex flex-col gap-1 p-1`}>
                <p className={tw`${sampleMode ? "bg-green-300" : "bg-red-400"}`}> Sample Mode {sampleMode ? "On" : "Off"} </p>
                {!sampleMode && <>
                  <p className={tw`bg-gray-200 cursor-pointer`} onClick={() => setPlcMode(true)}> Upload Data from PLC </p>
                  <p className={tw`bg-gray-200 cursor-pointer`}> Download from PLC </p>
                </>}
              </div>
            }
          </div>
          <div className={tw`flex gap-4 flex-grow text-sm`}>
            <div>
              <p className={tw`text-blue-600 text-lg ml-2 text-left`}> Air </p>
              <div className={tw`flex p-1 bg-blue-300`}>
                <div className={tw`w-[100px] p-1 mt-auto mb-0 flex flex-col gap-1`}>
                  {(plcMode ? plcAirTimeOn : airTimeOn).map(({ item }, i) => <p className={tw`${airCurrentControlType.length && airCurrentControlType.find((_, j) => i === j)!.label === "Close" ? "bg-red-400" : "bg-gray-400"} p-1`} key={i}>
                    Air {item}
                  </p>)}
                </div>
                <div className={tw`flex-grow mb-0 mt-auto`}>
                  <div className={tw`flex gap-1 bg-blue-300 w-full flex p-1`}>
                    <div className={tw`flex gap-1 flex-col justify-between w-1/3`}>
                      <p className={tw`px-1 w-full bg-gray-300`}> Apply % MIN MAX </p>
                      <Editable className="px-1 w-full bg-gray-300" editmode={true} value={airTimeOnMinMax} handleChange={(value: string) => setAirTimeOnMinMax(value)} />
                      <p className={tw`px-1 w-full bg-gray-300`}> Time On </p>
                    </div>
                    <div className={tw`flex flex-col justify-between w-1/3`}>
                      <p className={tw`px-1 w-full bg-gray-300`}> Apply % MIN MAX </p>
                      <Editable className="px-1 w-full bg-gray-300" editmode={true} value={airDurationMinMax} handleChange={(value: string) => setAirDurationMinMax(value)} />
                      <p className={tw`px-1 w-full bg-gray-300`}> Duration </p>
                    </div>
                    <div className={tw`flex flex-col justify-between w-1/3`}>
                      <p className={tw`px-1 w-full bg-gray-300`}> Apply % MIN MAX </p>
                      <Editable className="px-1 w-full bg-gray-300" editmode={true} value={airFlowSPMinMax} handleChange={(value: string) => setAirFlowSPMinMax(value)} />
                      <p className={tw`px-1 w-full bg-gray-300`}> Flow SP </p>
                    </div>
                  </div>
                  <div className={tw`w-full bg-blue-300 p-1 pt-0 flex gap-1`}>
                    <div className={tw`w-1/3 flex gap-1 flex-col`}>
                      <div className={tw`flex gap-1`}>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          min
                        </p>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          value
                        </p>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          max
                        </p>
                      </div>
                      {(plcMode ? plcAirTimeOn : airTimeOn).map((field, i) => <div key={i} className={tw`flex gap-1`}>
                        <Editable editmode={editmode} value={field.min} handleChange={(value: string) => handleChange(plcMode ? plcSetAirTimeOn : setAirTimeOn, field, value, "min")} className={tw`w-1/3 p-1 bg-gray-300`} />
                        <Editable editmode={editmode} value={field.value} handleChange={(value: string) => handleChange(plcMode ? plcSetAirTimeOn : setAirTimeOn, field, value, "value")} className={tw`w-1/3 p-1 bg-gray-200`} />
                        <Editable editmode={editmode} value={field.max} handleChange={(value: string) => handleChange(plcMode ? plcSetAirTimeOn : setAirTimeOn, field, value, "max")} className={tw`w-1/3 p-1 bg-gray-300`} />
                      </div>)}
                    </div>
                    <div className={tw`w-1/3 flex gap-1 flex-col`}>
                      <div className={tw`flex gap-1`}>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          min
                        </p>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          value
                        </p>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          max
                        </p>
                      </div>
                      {(plcMode ? plcAirDuration : airDuration).map((field, i) => <div key={i} className={tw`flex gap-1`}>
                        <Editable editmode={editmode} value={field.min} handleChange={(value: string) => handleChange(plcMode ? plcSetAirDuration : setAirDuration, field, value, "min")} className={tw`w-1/3 p-1 bg-gray-300`} />
                        <Editable editmode={editmode} value={field.value} handleChange={(value: string) => handleChange(plcMode ? plcSetAirDuration : setAirDuration, field, value, "value")} className={tw`w-1/3 p-1 bg-gray-200`} />
                        <Editable editmode={editmode} value={field.max} handleChange={(value: string) => handleChange(plcMode ? plcSetAirDuration : setAirDuration, field, value, "max")} className={tw`w-1/3 p-1 bg-gray-300`} />
                      </div>)}
                    </div>
                    <div className={tw`w-1/3 flex gap-1 flex-col`}>
                      <div className={tw`flex gap-1`}>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          min
                        </p>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          value
                        </p>
                        <p className={tw`w-1/3 p-1 bg-gray-400`}>
                          max
                        </p>
                      </div>
                      {(plcMode ? plcAirFlowSP : airFlowSP).map((field, i) => <div key={i} className={tw`flex gap-1`}>
                        <Editable editmode={editmode} value={field.min} handleChange={(value: string) => handleChange(plcMode ? plcSetAirFlowSP : setAirFlowSP, field, value, "min")} className={tw`w-1/3 p-1 bg-gray-300`} />
                        <Editable editmode={editmode} value={field.value} handleChange={(value: string) => handleChange(plcMode ? plcSetAirFlowSP : setAirFlowSP, field, value, "value")} className={tw`w-1/3 p-1 bg-gray-200`} />
                        <Editable editmode={editmode} value={field.max} handleChange={(value: string) => handleChange(plcMode ? plcSetAirFlowSP : setAirFlowSP, field, value, "max")} className={tw`w-1/3 p-1 bg-gray-300`} />
                      </div>)}
                    </div>
                  </div>
                </div>
                <div className={tw`w-[100px] flex flex-col gap-1 mt-auto mb-0 p-1`}>
                  <p className={tw`p-1 bg-gray-400`}> Control Type </p>
                  <div className={tw`flex flex-col gap-1`}>
                    {airCurrentControlType.map((_, i) => <div className={tw`flex flex-col gap-1`} key={i}>
                      <div className={tw`flex px-2 bg-gray-300 items-center justify-between`}>
                        <DropdownMenu onOptionSelect={(option) => setAirCurrentControlType(prev => prev.map((p, index) => index === i ? option : p))} defaultOption={controlType[0]} selectedOption={airCurrentControlType[i]} options={controlType} />
                      </div>
                    </div>)}
                  </div>
                </div>
                <div className={tw`w-[150px] flex flex-col gap-1 mt-auto mb-0 p-1`}>
                  <p className={tw`p-1 bg-gray-400`}> Mold Link </p>
                  <div className={tw`flex flex-col gap-1`}>
                    {airCurrentControlType.map((_, i) => <div className={tw`flex flex-col gap-1`} key={i}>
                      <div className={tw`flex px-2 bg-gray-300 justify-between items-center`}>
                        <DropdownMenu onOptionSelect={(option) => setAirCurrentMoldLink(prev => prev.map((p, index) => index === i ? option : p))} defaultOption={moldLink[0]} selectedOption={airCurrentMoldLink[i]} options={moldLink} />
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <p className={tw`text-blue-600 text-lg pl-2 text-left`}> Water </p>
                <div className={tw`flex p-1 bg-blue-300`}>
                  <div className={tw`w-[100px] p-1 mt-auto mb-0 flex flex-col gap-1`}>
                    {(plcMode ? plcWaterTimeOn : waterTimeOn).map(({ item }, i) => <p className={tw`${waterCurrentControlType.length && waterCurrentControlType.find((_, j) => i === j)!.label === "Close" ? "bg-red-400" : "bg-gray-400"} p-1`} key={i}>
                      Water {item}
                    </p>)}
                  </div>
                  <div className={tw`flex-grow mb-0 mt-auto`}>
                    <div className={tw`flex gap-1 bg-blue-300 w-full flex p-1`}>
                      <div className={tw`flex gap-1 flex-col justify-between w-1/3`}>
                        <p className={tw`px-1 w-full bg-gray-300`}> Apply % MIN MAX </p>
                        <Editable className="px-1 w-full bg-gray-300" editmode={true} value={waterTimeOnMinMax} handleChange={(value: string) => setWaterTimeOnMinMax(value)} />
                        <p className={tw`px-1 w-full bg-gray-300`}> Time On </p>
                      </div>
                      <div className={tw`flex flex-col justify-between w-1/3`}>
                        <p className={tw`px-1 w-full bg-gray-300`}> Apply % MIN MAX </p>
                        <Editable className="px-1 w-full bg-gray-300" editmode={true} value={waterDurationMinMax} handleChange={(value: string) => setWaterDurationMinMax(value)} />
                        <p className={tw`px-1 w-full bg-gray-300`}> Duration </p>
                      </div>
                      <div className={tw`flex flex-col justify-between w-1/3`}>
                        <p className={tw`px-1 w-full bg-gray-300`}> Apply % MIN MAX </p>
                        <Editable className="px-1 w-full bg-gray-300" editmode={true} value={waterFlowSPMinMax} handleChange={(value: string) => setWaterFlowSPMinMax(value)} />
                        <p className={tw`px-1 w-full bg-gray-300`}> Flow SP </p>
                      </div>
                    </div>
                    <div className={tw`w-full bg-blue-300 p-1 pt-0 flex gap-1`}>
                      <div className={tw`w-1/3 flex gap-1 flex-col`}>
                        <div className={tw`flex gap-1`}>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            min
                          </p>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            value
                          </p>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            max
                          </p>
                        </div>
                        {waterTimeOn.map((field, i) => <div key={i} className={tw`flex gap-1`}>
                          <Editable editmode={editmode} value={field.min} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterTimeOn : setWaterTimeOn, field, value, "min")} className={tw`w-1/3 p-1 bg-gray-300`} />
                          <Editable editmode={editmode} value={field.value} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterTimeOn : setWaterTimeOn, field, value, "value")} className={tw`w-1/3 p-1 bg-gray-200`} />
                          <Editable editmode={editmode} value={field.max} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterTimeOn : setWaterTimeOn, field, value, "max")} className={tw`w-1/3 p-1 bg-gray-300`} />
                        </div>)}
                      </div>
                      <div className={tw`w-1/3 flex gap-1 flex-col`}>
                        <div className={tw`flex gap-1`}>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            min
                          </p>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            value
                          </p>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            max
                          </p>
                        </div>
                        {(plcMode ? plcWaterDuration : waterDuration).map((field, i) => <div key={i} className={tw`flex gap-1`}>
                          <Editable editmode={editmode} value={field.min} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterDuration : setWaterDuration, field, value, "min")} className={tw`w-1/3 p-1 bg-gray-300`} />
                          <Editable editmode={editmode} value={field.value} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterDuration : setWaterDuration, field, value, "value")} className={tw`w-1/3 p-1 bg-gray-200`} />
                          <Editable editmode={editmode} value={field.max} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterDuration : setWaterDuration, field, value, "max")} className={tw`w-1/3 p-1 bg-gray-300`} />
                        </div>)}
                      </div>
                      <div className={tw`w-1/3 flex gap-1 flex-col`}>
                        <div className={tw`flex gap-1`}>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            min
                          </p>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            value
                          </p>
                          <p className={tw`w-1/3 p-1 bg-gray-400`}>
                            max
                          </p>
                        </div>
                        {(plcMode ? plcWaterFlowSP : waterFlowSP).map((field, i) => <div key={i} className={tw`flex gap-1`}>
                          <Editable editmode={editmode} value={field.min} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterFlowSP : setWaterFlowSP, field, value, "min")} className={tw`w-1/3 p-1 bg-gray-300`} />
                          <Editable editmode={editmode} value={field.value} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterFlowSP : setWaterFlowSP, field, value, "value")} className={tw`w-1/3 p-1 bg-gray-200`} />
                          <Editable editmode={editmode} value={field.max} handleChange={(value: string) => handleChange(plcMode ? plcSetWaterFlowSP : setWaterFlowSP, field, value, "max")} className={tw`w-1/3 p-1 bg-gray-300`} />
                        </div>)}
                      </div>
                    </div>
                  </div>
                  <div className={tw`w-[100px] flex flex-col gap-1 mt-auto mb-0 p-1`}>
                    <p className={tw`p-1 bg-gray-400`}> Control Type </p>
                    <div className={tw`flex flex-col gap-1`}>
                      {waterCurrentControlType.map((_, i) => <div className={tw`flex flex-col gap-1`} key={i}>
                        <div className={tw`flex px-2 bg-gray-300 items-center justify-between`}>
                          <DropdownMenu onOptionSelect={(option) => setWaterCurrentControlType(prev => prev.map((p, index) => index === i ? option : p))} defaultOption={controlType[0]} selectedOption={waterCurrentControlType[i]} options={controlType} />
                        </div>
                      </div>)}
                    </div>
                  </div>
                  <div className={tw`w-[150px] flex flex-col gap-1 mt-auto mb-0 p-1`}>
                    <p className={tw`p-1 bg-gray-400`}> Mold Link </p>
                    <div className={tw`flex flex-col gap-1`}>
                      {waterCurrentControlType.map((_, i) => <div className={tw`flex flex-col gap-1`} key={i}>
                        <div className={tw`flex px-2 bg-gray-300 justify-between items-center`}>
                          <DropdownMenu onOptionSelect={(option) => setWaterCurrentMoldLink(prev => prev.map((p, index) => index === i ? option : p))} defaultOption={moldLink[0]} selectedOption={waterCurrentMoldLink[i]} options={moldLink} />
                        </div>
                      </div>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className={tw`my-4`}>
                <p className={tw`text-blue-600 text-lg pl-2 text-left`}> Process </p>
                <div className={tw`w-[350px] bg-blue-300`}>
                  {processTable.map((p, i) => <div className={tw`flex gap-1 p-1`} key={i}>
                    <p className={tw`w-3/4 p-1 bg-gray-400`}> {p.label} </p>
                    <p className={tw`w-1/4 p-1 bg-gray-200`}> {p.value} </p>
                  </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  render((<App />))