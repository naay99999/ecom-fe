import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const team = [
  { name: 'Alice Chen', role: 'Frontend Lead', initials: 'AC', status: 'Online' },
  { name: 'Bob Kim', role: 'Backend Dev', initials: 'BK', status: 'Busy' },
  { name: 'Cara Lim', role: 'Designer', initials: 'CL', status: 'Away' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">shadcn/ui ✓ Working</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to React + shadcn/ui</h1>
          <p className="text-muted-foreground text-lg">
            shadcn is successfully set up. Here are some components in action.
          </p>
        </div>

        <Separator />

        {/* Button showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button variants from shadcn/ui.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        {/* Badge showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators and labels.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </CardContent>
        </Card>

        {/* Team card with Avatars */}
        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>Meet the people behind the project.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {team.map((member) => (
              <div key={member.name} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.initials}`} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-muted-foreground">{member.role}</span>
                </div>
                <Badge variant="outline" className="ml-auto">{member.status}</Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View all members</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

