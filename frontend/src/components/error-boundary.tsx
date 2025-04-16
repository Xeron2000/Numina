import { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>页面加载出错</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              抱歉，页面加载时发生错误。这可能是由于地图服务配置问题导致的。
            </p>
            <Button onClick={() => this.setState({ hasError: false })}>
              重试
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}