import { searchFunction } from './searchFunction';

describe('searchFunction util', () => {
  let mockDispatch;
  let mockPerform;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockPerform = jest.fn(param => ({ type: 'PERFORM', payload: param }));
  });

  it('calls dispatch with perform result using trimmed query', () => {
    searchFunction({
      dispatch: mockDispatch,
      query: '  hello world  ',
      perform: mockPerform,
    });
    expect(mockPerform).toHaveBeenCalledWith('hello world');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'PERFORM',
      payload: 'hello world',
    });
  });

  it('passes null to perform when query is empty string', () => {
    searchFunction({ dispatch: mockDispatch, query: '', perform: mockPerform });
    expect(mockPerform).toHaveBeenCalledWith(null);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'PERFORM',
      payload: null,
    });
  });

  it('passes empty string to perform when query is whitespace only', () => {
    searchFunction({
      dispatch: mockDispatch,
      query: '   ',
      perform: mockPerform,
    });
    expect(mockPerform).toHaveBeenCalledWith('');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PERFORM', payload: '' });
  });

  it('passes null to perform when query is undefined', () => {
    searchFunction({
      dispatch: mockDispatch,
      query: undefined,
      perform: mockPerform,
    });
    expect(mockPerform).toHaveBeenCalledWith(null);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'PERFORM',
      payload: null,
    });
  });
});
