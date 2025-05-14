import Form from '@/components/ui/form';
import './login.module.css';
import Input from '@/components/ui/input';
import useForm from '@/hooks/use-form';
import { LoginRequest } from '@/models/auth';
import { Link } from 'react-router-dom';
import useAuthService from '@/hooks/services/use-auth-service';

export default function Login() {
  const authService = useAuthService();
  const { handleSubmit, handleInputChange, formValidationData } = useForm<LoginRequest>({
    username: '',
    password: ''
  }, authService.login);

  return (
    <Form onSubmit={handleSubmit}>
      {/* <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/> */}
      <h1>Login</h1>
      <Input 
        label='Username'
        name='username'
        type='text'
        required
        onChange={handleInputChange}
        formValidationData={formValidationData}
      />
      <Input
        label='Password'
        name='password'
        type='password'
        minLength={4}
        onChange={handleInputChange}
        formValidationData={formValidationData}
      />
      <button type='submit'>Submit</button>
      <Link to='/register'>New to this site?</Link>
    </Form>
  );
}