import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

const SourcesDialog = ({ open, OnClose }) => {
  return (
    <Dialog open={open} onOpenChange={OnClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New source</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="publication-name" className="text-sm font-medium">
              Publication Name
            </Label>
            <Input
              placeholder="Publication Name"
              id="publication-name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="site-url" className="text-sm font-medium">
              Site URL
            </Label>
            <Input
              placeholder="RSS feed or site URL"
              id="site-url"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scraper-type" className="text-sm font-medium">
              Scraper Type
            </Label>
            <Select defaultValue="RSS / standard">
              <SelectTrigger className="w-full" id="scraper-type">
                <SelectValue placeholder="Select scraper type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="RSS / standard">RSS / standard</SelectItem>   
                  <SelectItem value="Custom Scraper">Custom Scraper</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default SourcesDialog