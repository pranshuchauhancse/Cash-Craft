import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts'

export function LineChartCard({ title, data, dataKeyX='name', dataKeyY='value' }){
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{width:'100%', height:260}}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeyX} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKeyY} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function PieChartCard({ title, data, dataKey='value', nameKey='name' }){
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{width:'100%', height:260}}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={90} label>
              {data.map((_, idx) => <Cell key={idx} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
