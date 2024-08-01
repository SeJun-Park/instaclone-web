// import original module declarations
import 'styled-components';
import { StringLiteral } from 'typescript';


// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    fontColor: string;
    bgColor : string;
    accentColor: string;
    borderColor: string;
  }
}