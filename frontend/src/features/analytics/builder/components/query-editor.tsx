import Editor from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function QueryEditor({ value, onChange, disabled }: QueryEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">查询编辑器</CardTitle>
      </CardHeader>
      <CardContent>
        <Editor
          height="300px"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            readOnly: disabled,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </CardContent>
    </Card>
  )
}