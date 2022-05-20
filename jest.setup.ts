import ReactAdapter from '@wojtekmaj/enzyme-adapter-react-17'
import { configure } from 'enzyme'

configure({ adapter: new ReactAdapter() })
