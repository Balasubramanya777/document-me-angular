import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceToNow, parseISO } from 'date-fns';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

    transform(value: string | null | undefined): string {
        if (!value) return '';
        return formatDistanceToNow(parseISO(value), { addSuffix: true });
    }

}