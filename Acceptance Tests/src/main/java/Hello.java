import java.util.Arrays;

/**
 * Created by Daniel on 21-Apr-17.
 */
public class Hello {
    public static void Hello() {
        int[] arr = {1, 2, 3, 4, 5};
        System.out.println(Arrays.stream(arr).filter(i -> i%2==0));

    }
}
