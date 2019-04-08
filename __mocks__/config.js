import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });
const {shallow, mount} = Enzyme
export {shallow, mount}
